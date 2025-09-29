# Architecture Overview

## System Architecture

Foodime is built as a monorepo using Turborepo and pnpm, with a microservices-inspired architecture that separates concerns into distinct packages and applications.

### High-Level Architecture

```mermaid title="Foodime Architecture" type="diagram"
graph TD;
    A["Customer"] -->|"Places call"| B["Twilio Service"]
    B -->|"Forwards call"| C["Backend API"]
    C -->|"Processes speech"| D["OpenAI Service"]
    D -->|"Returns response"| C
    C -->|"Converts to speech"| E["ElevenLabs Service"]
    E -->|"Returns audio"| C
    C -->|"Plays response"| B
    B -->|"Delivers audio"| A
    F["Restaurant Staff"] -->|"Accesses"| G["Customer Dashboard"]
    G -->|"API Requests"| C
    H["Admin"] -->|"Accesses"| I["Admin Panel"]
    I -->|"API Requests"| C
    C -->|"Stores/Retrieves data"| J["Supabase Database"]
