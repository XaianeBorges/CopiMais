#!/usr/bin/env bash
# Iniciar CopiMais (Linux/macOS/Unix) e abrir navegador automaticamente quando pronto
set -euo pipefail

# Resolve o diretório onde o script está localizado (lida com links)
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  DIR="$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
DIR="$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)"
JAR_NAME="copimais.jar"
LOG_FILE="$DIR/app.log"

# Função para iniciar o servidor em background
start_server() {
  if [ -x "$DIR/jre/bin/java" ]; then
    "$DIR/jre/bin/java" -Xms256m -Xmx1024m -jar "$DIR/$JAR_NAME" > "$LOG_FILE" 2>&1 &
  elif [ -n "${JAVA_HOME-}" ] && [ -x "${JAVA_HOME}/bin/java" ]; then
    "${JAVA_HOME}/bin/java" -Xms256m -Xmx1024m -jar "$DIR/$JAR_NAME" > "$LOG_FILE" 2>&1 &
  elif command -v java >/dev/null 2>&1; then
    java -Xms256m -Xmx1024m -jar "$DIR/$JAR_NAME" > "$LOG_FILE" 2>&1 &
  else
    echo "Erro: não foi possível encontrar um executável java. Instale o Java 17+ ou coloque um JRE na pasta 'jre' ao lado deste script." >&2
    exit 1
  fi
}

# Inicia o servidor
start_server

# Poll para checar se a aplicação responde; timeout ~30s
for i in $(seq 1 30); do
  if command -v curl >/dev/null 2>&1; then
    if curl -sSf "http://localhost:8080/" >/dev/null 2>&1; then
      # Abre navegador conforme plataforma
      if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "http://localhost:8080/" || true
      elif command -v open >/dev/null 2>&1; then
        open "http://localhost:8080/" || true
      else
        echo "Abra seu navegador em: http://localhost:8080/"
      fi
      exit 0
    fi
  elif command -v wget >/dev/null 2>&1; then
    if wget -q --spider http://localhost:8080/; then
      if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "http://localhost:8080/" || true
      elif command -v open >/dev/null 2>&1; then
        open "http://localhost:8080/" || true
      else
        echo "Abra seu navegador em: http://localhost:8080/"
      fi
      exit 0
    fi
  else
    # sem curl/wget, esperar e abrir sem checar
    sleep 1
  fi
  sleep 1
done

echo "Aplicação não respondeu depois de ~30s. Verifique $LOG_FILE para diagnósticos." >&2
exit 1
