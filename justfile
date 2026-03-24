set shell := ["bash", "-cu"]
mod backend "backend/justfile"
mod frontend "frontend/justfile"

default:
    just --list

list: default
