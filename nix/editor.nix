{
  cargo-tauri,
  glib-networking,
  lib,
  libsoup_3,
  makeBinaryWrapper,
  mold,
  nodejs-slim,
  openssl,
  pkg-config,
  rpmextract,
  rustPlatform,
  stdenv,
  webkitgtk_4_1,
  wrapGAppsHook,
  yarn-berry,
}:
let
  cargoToml = builtins.fromTOML (builtins.readFile ../ms0503-dev-editor/Cargo.toml);
  src = ../.;
  yarnHash = "sha256-N4PJhw3JXVr4ctFVAI5pqvAdcrZasaGXdT7+pnZZCNw=";
in
rustPlatform.buildRustPackage {
  inherit src;
  inherit (cargoToml.package) version;
  RUSTFLAGS = "-Clink-arg=-fuse-ld=mold";
  buildAndTestSubdir = "ms0503-dev-editor";
  buildInputs =
    [
      openssl
    ]
    ++ lib.optionals stdenv.hostPlatform.isLinux [
      glib-networking
      libsoup_3
      makeBinaryWrapper
      webkitgtk_4_1
    ];
  cargoLock.lockFile = ../Cargo.lock;
  meta = {
    broken = stdenv.hostPlatform.isDarwin;
    description = "An editor for writing posts of The Seaside Snippet Shack";
    license = lib.licenses.mit;
    mainProgram = "ms0503-dev-editor";
    platforms = lib.platforms.unix;
    sourceProvenance = with lib.sourceTypes; [
      fromSource
    ];
  };
  missingHashes = ./missing-hashes.json;
  nativeBuildInputs = [
    cargo-tauri.hook
    mold
    nodejs-slim
    pkg-config
    rpmextract
    wrapGAppsHook
    yarn-berry
    yarn-berry.yarnBerryConfigHook
  ];
  offlineCache = yarn-berry.fetchYarnBerryDeps {
    inherit src;
    hash = yarnHash;
    missingHashes = ./missing-hashes.json;
  };
  passthru = {
    inherit (yarn-berry) yarn-berry-fetcher;
  };
  pname = cargoToml.package.name;
  postInstall = lib.optionalString stdenv.hostPlatform.isLinux ''
    wrapProgram "$out/bin/$pname" --set APPIMAGE "$pname"
  '';
  useFetchCargoVendor = true;
}
