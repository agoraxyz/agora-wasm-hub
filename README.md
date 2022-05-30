## Description

This repository aims to provide a easy-to-use collection of wasm packages used
by Agora. These packages will mostly be generated from Rust code and pushed
here to a specific branch, ready to be pulled into a frontend application as a
github dependency.

## Setup

### Generate a Personal Access Token

On github, under your profile `Settings/Developer settings/Personal access
tokens`, generate a Personal Access Token (PAT). Make sure that the scope of
the token is set to at least `repo`, i.e. you have full control of private
repositories. This will be important when pushing code from github actions
using your PAT. Note, that eventually you'll have to generate a new PAT after
the expiration date of your newly generated one. Copy the newly generated
token, you'll need it in the next step.

IMPORTANT: It is enough for only one person to generate a PAT for a given
github action secret.

### Add the PAT to the wasm repo's secrets

This step is necessary to authorize github actions (that we will set up next)
to auto-push the generated wasm binaries to this repo for example. 

Go to the repo where your (Rust) code is located. This should be the repo
where you'd want to build the wasm binaries automatically using github
actions. Find `Settings/Secrets/Actions` and press `New repository secret`.
Provide a name like `GH_ACTIONS_PAT` and paste the PAT value generated in
the previous step. After generating the secret, you should see a green lock
with `GH_ACTIONS_PAT` next to it under `Repository secrets`.

### Build via Github Actions

Add something like this to your Rust repository under `.github/workflows`

```
name: Build wasm binaries

on:
  push:
    branches: [main]

jobs:
  build-wasm:
    name: wasm-pack build
    runs-on: ubuntu-latest
    env:
      ACCESS_HEADER: user:${{ secrets.GH_ACTIONS_PAT }}@
      WASM_HUB_REPO: agora-wasm-hub
      WASM_HUB_BRANCH: xyz-rust
    steps:
      - uses: actions/checkout@v2
      - run: |
          cargo install wasm-pack
          git config --global user.name "Your Name"
          git config --global user.email "your@email.xyz"
          wasm-pack build xyz-rust --target bundler --out-name index --out-dir ../out-dir
          cd out-dir
          rm .gitignore
          git add -A
          git commit -m "Auto-generated wasm binaries"
          git remote add origin https://${ACCESS_HEADER}github.com/agoraxyz/${WASM_HUB_REPO}.git
          git branch -M $WASM_HUB_REPO
          git push -uf origin $WASM_HUB_BRANCH
```

TODO

### Use as an npm dependency
TODO
