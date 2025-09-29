#!/usr/bin/env python3
"""
Foodime AI - TTS Model Downloader
Downloads and manages high-quality TTS models from Hugging Face
that are similar to ElevenLabs in quality.
"""

import os
import json
import argparse
from huggingface_hub import hf_hub_download, snapshot_download, HfApi
from tqdm import tqdm
import torch
import yaml

# Models configuration
RECOMMENDED_MODELS = {
    "suno/bark-small": {
        "description": "Small, fast version of Bark text-to-audio model",
        "type": "transformer",
        "size": "900MB",
        "languages": ["en"],
        "features": ["music", "effects", "emotion", "voice-cloning"],
        "quality": "High",
        "files": [
            "bark",
            "tokenizer",
            "text_encoder",
            "fine_tune",
            "coarse_acoustics",
            "codec"
        ]
    }
}

# Voice styles/emotions available for each model
VOICE_STYLES = {
    "suno/bark-small": [
        "neutral", "happy", "sad", "angry", "excited",
        "professional", "friendly", "whispering", "shouting",
        "news-anchor", "documentary", "movie-trailer"
    ]
}

def create_model_info():
    """Create model info files with metadata and usage instructions"""
    os.makedirs("models/tts", exist_ok=True)
    
    # Create main README
    readme_content = """# Foodime AI - TTS Models

## Available Models

These models are selected for their similarity to ElevenLabs in terms of voice quality and features.

"""
    for model_id, info in RECOMMENDED_MODELS.items():
        readme_content += f"""### {model_id.split('/')[-1]}
- Source: {model_id}
- Description: {info['description']}
- Size: {info['size']}
- Languages: {', '.join(info['languages'])}
- Features: {', '.join(info['features'])}
- Quality: {info['quality']}
- Voice Styles: {', '.join(VOICE_STYLES[model_id])}
- Files: {', '.join(info['files'])}

"""

    with open("models/tts/README.md", "w") as f:
        f.write(readme_content)

    # Create model configs
    os.makedirs("models/tts/configs", exist_ok=True)
    for model_id, info in RECOMMENDED_MODELS.items():
        config = {
            "model_id": model_id,
            "info": info,
            "voice_styles": VOICE_STYLES[model_id],
            "local_path": f"models/tts/{model_id.split('/')[-1]}",
            "required_files": info['files']
        }
        
        with open(f"models/tts/configs/{model_id.split('/')[-1]}.yaml", "w") as f:
            yaml.dump(config, f, default_flow_style=False)

def download_model(model_id, token):
    """Download a specific model and its files"""
    print(f"\nDownloading {model_id}...")
    
    try:
        # Create model directory
        model_name = model_id.split('/')[-1]
        model_path = f"models/tts/{model_name}"
        os.makedirs(model_path, exist_ok=True)
        
        # Download all model files
        if model_id == "suno/bark-small":
            # Bark needs special handling - download the entire repository
            snapshot_download(
                repo_id=model_id,
                local_dir=model_path,
                token=token,
                ignore_patterns=["*.md", "*.git*", "samples/*"]
            )
        else:
            # Download individual files
            for file in tqdm(RECOMMENDED_MODELS[model_id]['files'], desc="Files"):
                try:
                    hf_hub_download(
                        repo_id=model_id,
                        filename=file,
                        local_dir=model_path,
                        token=token,
                        force_download=True
                    )
                except Exception as e:
                    print(f"Error downloading {file}: {e}")
                    # Try alternative paths
                    try:
                        alt_paths = [
                            f"model/{file}",
                            f"models/{file}",
                            f"checkpoints/{file}",
                            f"assets/{file}",
                            f"base/{file}"
                        ]
                        for alt_path in alt_paths:
                            try:
                                hf_hub_download(
                                    repo_id=model_id,
                                    filename=alt_path,
                                    local_dir=model_path,
                                    token=token,
                                    force_download=True
                                )
                                print(f"✅ Found {file} at {alt_path}")
                                break
                            except:
                                continue
                    except Exception as e2:
                        print(f"❌ Failed to find {file} in alternative paths: {e2}")
                        continue
        
        print(f"✅ Successfully downloaded {model_id}")
        
    except Exception as e:
        print(f"❌ Error downloading {model_id}: {e}")

def download_all_models(token):
    """Download all recommended models"""
    print("🚀 Downloading all recommended TTS models...")
    
    for model_id in RECOMMENDED_MODELS:
        download_model(model_id, token)

def list_models():
    """List all available models and their details"""
    print("\n🎯 Available TTS Models:\n")
    
    for model_id, info in RECOMMENDED_MODELS.items():
        print(f"📦 {model_id}")
        print(f"   Description: {info['description']}")
        print(f"   Size: {info['size']}")
        print(f"   Languages: {', '.join(info['languages'])}")
        print(f"   Features: {', '.join(info['features'])}")
        print(f"   Quality: {info['quality']}")
        print(f"   Voice Styles: {', '.join(VOICE_STYLES[model_id])}")
        print(f"   Files: {', '.join(info['files'])}\n")

def main():
    parser = argparse.ArgumentParser(description="Foodime AI - TTS Model Manager")
    parser.add_argument("--token", help="Hugging Face API token", default=os.getenv("HUGGINGFACE_API_KEY"))
    parser.add_argument("--list", action="store_true", help="List available models")
    parser.add_argument("--download", help="Download specific model by ID")
    parser.add_argument("--download-all", action="store_true", help="Download all recommended models")
    parser.add_argument("--create-info", action="store_true", help="Create model info files")
    
    args = parser.parse_args()
    
    if not args.token:
        print("❌ Error: Hugging Face API token required. Set HUGGINGFACE_API_KEY or use --token")
        return
    
    if args.list:
        list_models()
        return
    
    if args.create_info:
        create_model_info()
        print("✅ Created model info files")
        return
    
    if args.download:
        if args.download not in RECOMMENDED_MODELS:
            print(f"❌ Error: Model {args.download} not found in recommended models")
            return
        download_model(args.download, args.token)
    
    if args.download_all:
        download_all_models(args.token)

if __name__ == "__main__":
    main()
