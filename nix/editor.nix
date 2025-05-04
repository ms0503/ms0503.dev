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
  rustPlatform,
  stdenv,
  webkitgtk_4_1,
  wrapGAppsHook3,
  yarn-berry,
}:
let
  cargoToml = builtins.fromTOML (builtins.readFile ../ms0503-dev-editor/Cargo.toml);
  missingHashes = ./missing-hashes.json;
  src = ../.;
  yarnHash = "sha256-N4PJhw3JXVr4ctFVAI5pqvAdcrZasaGXdT7+pnZZCNw=";
in
rustPlatform.buildRustPackage {
  inherit missingHashes src;
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
  nativeBuildInputs = [
    cargo-tauri.hook
    mold
    nodejs-slim
    pkg-config
    wrapGAppsHook3
    yarn-berry
    yarn-berry.yarnBerryConfigHook
  ] ++ lib.optional stdenv.hostPlatform.isLinux makeBinaryWrapper;
  offlineCache = yarn-berry.fetchYarnBerryDeps {
    inherit missingHashes src;
    hash = yarnHash;
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
