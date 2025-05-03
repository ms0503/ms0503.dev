{ inputs, ... }:
{
  imports = [
    inputs.git-hooks.flakeModule
  ];
  perSystem =
    { config, ... }:
    {
      pre-commit = {
        check.enable = true;
        settings = {
          hooks = {
            actionlint.enable = true;
            check-json = {
              enable = true;
              excludes = [
                "ms0503-dev-editor/gen"
              ];
            };
            check-toml.enable = true;
            editorconfig-checker = {
              enable = true;
              excludes = [
                ".*/worker-configuration.d.ts"
                ".idea"
                "Cargo.lock"
                "flake.lock"
                "ms0503-dev-db/build"
                "ms0503-dev-site/noto-sans-mono-cjk-jp-include.txt"
                "nix/missing-hashes.json"
                "yarn.lock"
              ];
            };
            eslint = {
              enable = true;
              entry = "node_modules/.bin/eslint";
              excludes = [
                "ms0503-dev-db/dist"
              ];
              package = null;
            };
            markdownlint = {
              enable = true;
              settings.configuration = {
                MD013 = false;
                MD026 = false;
              };
            };
            treefmt = {
              enable = true;
              package = config.treefmt.build.wrapper;
            };
            yamlfmt.enable = true;
            yamllint.enable = true;
          };
          src = ./.;
        };
      };
    };
}
