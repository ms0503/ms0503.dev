{
  inputs = {
    fenix = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:nix-community/fenix";
    };
    flake-parts = {
      inputs.nixpkgs-lib.follows = "nixpkgs";
      url = "github:hercules-ci/flake-parts";
    };
    git-hooks = {
      inputs = {
        flake-compat.follows = "";
        nixpkgs.follows = "nixpkgs";
      };
      url = "github:cachix/git-hooks.nix";
    };
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems = {
      flake = false;
      url = "github:nix-systems/default";
    };
    treefmt-nix = {
      inputs.nixpkgs.follows = "nixpkgs";
      url = "github:numtide/treefmt-nix";
    };
  };
  outputs =
    inputs@{ flake-parts, systems, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        ./treefmt.nix
        ./git-hooks.nix
      ];
      perSystem =
        {
          config,
          inputs',
          lib,
          pkgs,
          ...
        }:
        {
          devShells.default = pkgs.mkShell {
            LD_LIBRARY_PATH = lib.makeLibraryPath (
              with pkgs;
              [
                at-spi2-atk
                atkmm
                cairo
                gdk-pixbuf
                glib
                gobject-introspection
                gtk3
                harfbuzz
                librsvg
                libsoup_3
                openssl
                pango
                webkitgtk_4_1
                zlib
              ]
            );
            packages = with pkgs; [
              (
                with inputs'.fenix.packages;
                combine [
                  latest.toolchain
                  targets.wasm32-unknown-unknown.latest.rust-std
                ]
              )
              cargo-generate
              cargo-tauri
              fontforge
              nodejs-slim
              worker-build
              xdg-utils
              yarn-berry
            ];
            shellHook = ''
              ${config.pre-commit.installationScript}
              yarn install
            '';
          };
          packages.editor = pkgs.callPackage ./nix/editor.nix {
            rustPlatform = pkgs.makeRustPlatform {
              cargo = inputs'.fenix.packages.latest.toolchain;
              rustc = inputs'.fenix.packages.latest.toolchain;
            };
          };
        };
      systems = import systems;
    };
}
