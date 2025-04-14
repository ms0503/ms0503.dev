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
          self',
          ...
        }:
        {
          devShells.default =
            let
              inherit (self'.packages) prisma-engines;
            in
            pkgs.mkShell {
              packages = with pkgs; [
                fontforge
                nodePackages.yarn
                nodejs-slim
                openssl
              ];
              shellHook = ''
                ${config.pre-commit.installationScript}
                export PRISMA_FMT_BINARY=${prisma-engines}/bin/prisma-fmt
                export PRISMA_QUERY_ENGINE_BINARY=${prisma-engines}/bin/query-engine
                export PRISMA_QUERY_ENGINE_LIBRARY=${prisma-engines}/lib/libquery_engine.node
                export PRISMA_SCHEMA_ENGINE_BINARY=${prisma-engines}/bin/schema-engine
                yarn install
              '';
            };
          packages.prisma-engines =
            with pkgs;
            let
              cargoHash = "sha256-BiSo3BgVxiPAfSIPUv0SqH+XgU1Vh4wws0set4cLzDU=";
              hash = "sha256-moonBNNGWECGPvhyyeHKKAQRXj5lNP0k99JB+1POMUE=";
              rustPlatform = makeRustPlatform {
                cargo = inputs'.fenix.packages.latest.toolchain;
                rustc = inputs'.fenix.packages.latest.toolchain;
              };
              version = "6.6.0";
            in
            rustPlatform.buildRustPackage rec {
              inherit cargoHash version;
              OPENSSL_NO_VENDOR = 1;
              buildInputs = [
                openssl
              ];
              cargoBuildFlags = [
                "-p"
                "prisma-fmt"
                "-p"
                "query-engine"
                "-p"
                "query-engine-node-api"
                "-p"
                "schema-engine-cli"
              ];
              doCheck = false;
              meta = {
                description = "Collection of engines that power the core stack for Prisma";
                homepage = "https://www.prisma.io";
                license = lib.licenses.asl20;
                mainProgram = "prisma";
                platforms = lib.platforms.unix;
              };
              nativeBuildInputs = [
                pkg-config
              ];
              pname = "prisma-engines";
              postInstall = ''
                mv "$out/lib/libquery_engine${stdenv.hostPlatform.extensions.sharedLibrary}" "$out/lib/libquery_engine.node"
              '';
              preBuild = ''
                export GIT_HASH=0000000000000000000000000000000000000000
                export OPENSSL_DIR=${lib.getDev openssl}
                export OPENSSL_LIB_DIR=${lib.getLib openssl}/lib
                export PROTOC=${protobuf}/bin/protoc
                export PROTOC_INCLUDE=${protobuf}/include
                export SQLITE_MAX_EXPR_DEPTH=10000
                export SQLITE_MAX_VARIABLE_NUMBER=250000
              '';
              src = fetchFromGitHub {
                inherit hash;
                owner = "prisma";
                repo = "prisma-engines";
                rev = version;
              };
              useFetchCargoVendor = true;
            };
        };
      systems = import systems;
    };
}
