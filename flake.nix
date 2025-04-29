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
    nixpkgs-yarn-berry.url = "github:NixOS/nixpkgs/master";
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
              at-spi2-atk
              atkmm
              cairo
              cargo-generate
              cargo-tauri
              fontforge
              gdk-pixbuf
              glib
              gobject-introspection
              gtk3
              harfbuzz
              librsvg
              libsoup_3
              nodePackages.yarn
              nodejs-slim
              openssl
              pango
              pkg-config
              webkitgtk_4_1
              worker-build
              xdg-utils
            ];
            shellHook = ''
              ${config.pre-commit.installationScript}
              export GSETTINGS_SCHEMA_DIR="${pkgs.glib.dev}/share/glib-2.0/schemas"
              yarn install
            '';
          };
          packages.editor = pkgs.callPackage ./nix/editor.nix {
            inherit (inputs'.nixpkgs-yarn-berry.legacyPackages) yarn-berry;
            rustPlatform = pkgs.makeRustPlatform {
              cargo = inputs'.fenix.packages.latest.toolchain;
              rustc = inputs'.fenix.packages.latest.toolchain;
            };
          };
        };
      systems = import systems;
    };
}
