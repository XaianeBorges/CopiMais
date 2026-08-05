#!/usr/bin/env bash
# Iniciar CopiMais (Linux/macOS/Unix)
# Comportamento equivalente ao run.bat: se houver uma pasta jre/ ao lado do script, usa-a; senão usa o java do PATH.
set -euo pipefail

# Resolve o diretório onde o script está localizado (lida com links)
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve links
  DIR="$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
DIR="$(cd -P "$(dirname "$SOURCE")" >/dev/null 2>&1 && pwd)"
JAR_NAME="copimais.jar"

JRE_LOCAL="$DIR/jre/bin/java"

# Preferir JRE local se existir e for executável
if [ -x "$JRE_LOCAL" ]; then
  "$JRE_LOCAL" -Xms256m -Xmx1024m -jar "$DIR/$JAR_NAME"
  exit $?
fi

# Se JAVA_HOME estiver definido, usá-lo
if [ -n "${JAVA_HOME-}" ] && [ -x "${JAVA_HOME}/bin/java" ]; then
  "${JAVA_HOME}/bin/java" -Xms256m -Xmx1024m -jar "$DIR/$JAR_NAME"
  exit $?
fi

# Por fim, usar java do PATH
if command -v java >/dev/null 2>&1; then
  java -Xms256m -Xmx1024m -jar "$DIR/$JAR_NAME"
  exit $?
fi

echo "Erro: não foi possível encontrar um executável java. Instale o Java 17+ ou coloque um JRE na pasta 'jre' ao lado deste script." >&2
exit 1
