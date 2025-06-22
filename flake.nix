{
  inputs = {
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
        { config, pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            packages = with pkgs; [
              nodejs-slim
              yarn-berry
            ];
            shellHook = ''
              ${config.pre-commit.installationScript}
              yarn install
            '';
          };
        };
      systems = import systems;
    };
}
