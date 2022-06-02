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
  push: [main, wasm-dev]

jobs:
  build-wasm:
    name: wasm-pack build
    runs-on: ubuntu-latest
    env:
      PAT: ${{ secrets.GH_ACTIONS_PAT }}
      TARGET_REPO: organization/target-repo.git
      TARGET_BRANCH: ${{ github.repository }}@${{ github.ref_name }}
      WASM_DIR: rust-to-wasm
    steps:
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: nightly
          override: true
          profile: minimal

      - uses: actions/checkout@v2
      - run: |
          cargo install wasm-pack
          git config --global user.name "Your Name"
          git config --global user.email "your@email.xyz"
          bash build-wasm.sh
```

Let's look at what's happening in the workflow script above:

- this action will be run whenever we push code to `main` or `wasm-dev`
- we set three important environment variables
  - `PAT`: this is the secret PAT added to the repo which authorizes
the workflow to push to the wasm hub repo
  - `TARGET_REPO`: this is the name of the wasm repo where we are pushing the
code
  - `TARGET_BRANCH`" this is the branch in `TARGET_REPO` to which we push our
code (e.g. `some-rust-lib@some-branch`)
- we set up the nightly toolchain (this is optional and needed only if you use
  unstable features)
- we install `wasm-pack`, build our code, set some github config variables,
  and run the `build-wasm.sh` script that will build the wasm binary
  and push it to the target repo

You can find `build-wasm.sh` here on the `main` branch as a reference.

### Use as an npm dependency

Suppose you want to use wasm generated from `rust-repo` on the `main` branch. Then you can
add the following to your `package.json`:
```
"dependencies": {
  "my-rust": "git+https//github.com/wasm-hub.git#rust-repo@main"
}
```
This will pull in the wasm code from branch `rust-repo@main` of repo `wasm-hub`.
