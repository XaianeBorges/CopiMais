CopiMais
=========

Este repositório contém a aplicação CopiMais (backend Spring Boot + frontend React/Vite).

Esse app tem por objetivo ajudar no gerenciamento de uma copiadora, permitindo cadastrar produtos, registrar vendas , e ver quanto foi arrecadado durante o mês.

Pre-requisitos para compilar 
- Java JDK 17+
- Maven 3.6+
- Node.js 16/18+ e npm (caso prefira rodar frontend manualmente)

Build e execução (automático via Maven)
1. Do diretório raiz do projeto (onde está o pom.xml):
   mvn clean package -DskipTests

   O pom foi configurado para executar o build do frontend automaticamente (instala Node/npm localmente, npm install e npm run build), copiar o conteúdo de frontend/dist para o diretório de recursos e empacotar tudo em um jar executável.

2. Após o sucesso, pegue o jar em target/ e renomeie ou mova para o diretório de distribuição. Por exemplo:
   copy target\copimais-0.0.1-SNAPSHOT.jar copimais.jar  (Windows)
   cp target/copimais-0.0.1-SNAPSHOT.jar copimais.jar      (Linux/macOS)

3. Executar (Windows):
   - Coloque copimais.jar na mesma pasta que run.bat e execute run.bat.

   Executar (Linux/macOS):
   - Coloque copimais.jar na mesma pasta que run.sh, torne o script executável (chmod +x run.sh) e execute ./run.sh

Observações para distribuição ao usuário final
- É possível distribuir apenas o copimais.jar e os scripts run.bat/run.sh. O usuário precisará ter Java 17 instalado.
- Para evitar exigir Java no sistema do usuário, inclua uma JRE dentro da pasta (nomeada jre/) e os scripts já tentam usar jre/bin/java antes do java no PATH.
- Alternativamente, gerar instaladores nativos com jpackage (recomendado para experiência de instalação mais amigável).

Configurações importantes
- Banco de dados: um arquivo SQLite será criado em: ${user.home}/copimais-app/dados.db
- Usuário inicial: DatabaseSeeder cria um usuário "admin" com senha "admin123" na primeira execução (ver DatabaseSeeder.java).

Como testar localmente (alternativa manual)
1. Build frontend manualmente (opcional):
   cd frontend
   npm install
   npm run build

2. Copiar frontend/dist -> src/main/resources/static:
   (ex.: on Windows PowerShell)
   Remove-Item -Recurse -Force src\main\resources\static\*
   Copy-Item -Recurse frontend\dist\* src\main\resources\static\

3. Build backend e rodar:
   mvn clean package -DskipTests
   java -jar target/copimais-0.0.1-SNAPSHOT.jar


