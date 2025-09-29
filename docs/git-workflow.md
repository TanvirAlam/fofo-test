# Git Workflow

This document outlines the Git workflow for the Foodime project.

## Overview

We follow a feature branch workflow with pull requests. This means:

1. The `main` branch is always deployable
2. Development happens on feature branches
3. Changes are integrated through pull requests
4. We use continuous integration to validate changes

## Basic Workflow

```mermaid title="Git Workflow" type="diagram"
graph TD;
    A["main branch"] -->|"git checkout -b feature/xyz"| B["feature branch"]
    B -->|"commit changes"| C["feature development"]
    C -->|"git push -u origin feature/xyz"| D["create pull request"]
    D -->|"code review"| E["approved"]
    E -->|"merge"| A
