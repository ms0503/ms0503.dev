{
  cairo,
  cargo-tauri,
  gdk-pixbuf,
  glib,
  gtk3,
  lib,
  libsoup_3,
  nodejs-slim,
  openssl,
  patchelf,
  pkg-config,
  rpmextract,
  rustPlatform,
  webkitgtk_4_1,
  yarn-berry,
}:
let
  cargoToml = builtins.fromTOML (builtins.readFile ../ms0503-dev-editor/src-tauri/Cargo.toml);
  libraries = [
    cairo
    gdk-pixbuf
    glib
    gtk3
    libsoup_3
    openssl
    webkitgtk_4_1
  ];
  src = ../.;
  yarnHash = "sha256-N4PJhw3JXVr4ctFVAI5pqvAdcrZasaGXdT7+pnZZCNw=";
in
rustPlatform.buildRustPackage {
  inherit src;
  inherit (cargoToml.package) version;
  buildAndTestSubdir = "ms0503-dev-editor";
  buildPhase = ''
    runHook preBuild
    yarn workspace ms0503-dev-editor run tauri build
    runHook postBuild
  '';
  buildInputs = libraries;
  cargoLock.lockFile = ../Cargo.lock;
  installPhase = ''
    runHook preInstall
    install -dm755 "$out"
    cd target/release/bundle/rpm
    rpmextract "$pname-$version-1.x86_64.rpm"
    cp -r usr/* "$out"
    runHook postInstall
  '';
  meta = {
    description = "An editor for writing posts of The Seaside Snippet Shack";
    license = lib.licenses.mit;
    mainProgram = "ms0503-dev-editor";
    platforms = [
      "x86_64-linux"
    ];
    sourceProvenance = with lib.sourceTypes; [
      fromSource
    ];
  };
  missingHashes = ./missing-hashes.json;
  nativeBuildInputs = [
    cargo-tauri.hook
    nodejs-slim
    patchelf
    pkg-config
    rpmextract
    yarn-berry
    yarn-berry.yarnBerryConfigHook
  ];
  offlineCache = yarn-berry.fetchYarnBerryDeps {
    inherit src;
    hash = yarnHash;
    missingHashes = ./missing-hashes.json;
  };
  pname = "ms0503-dev-editor";
  postFixup = ''
    patchelf --add-rpath "$rpath" "$out/bin/$pname"
  '';
  rpath = lib.makeLibraryPath libraries;
  useFetchCargoVendor = true;
}
