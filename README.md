CopiMais
=========

Este repositório contém a aplicação CopiMais (backend Spring Boot + frontend React/Vite).

Objetivo deste commit
- Ajuste do frontend para permitir uso em produção (URL relativa / variável de ambiente).
- Automatização do build do frontend dentro do build Maven do backend (plugins adicionados no pom.xml).
- Criação de scripts de execução (run.bat, run.sh) e README com instruções básicas.

Pre-requisitos para compilar (desenvolvedor que vai gerar o artefato)
- Java JDK 17+
- Maven 3.6+
- Node.js 16/18+ e npm (caso prefira rodar frontend manualmente)

Build e execução (automático via Maven)
1. Do diretório raiz do projeto (onde está o pom.xml):
   mvn clean package -DskipTests

   O pom foi configurado para executar o build do frontend automaticamente (instala Node/npm localmente, npm install e npm run build), copiar o conteúdo de frontend/dist para o diretório de recursos e empacotar tudo em um jar executável.

2. Após o sucesso, o JAR executável estará em `target\copimais.jar` (o nome é fixado pelo `pom.xml`).

3. Executar (Windows):
   - Coloque copimais.jar na mesma pasta que run.bat e execute run.bat.

   Executar (Linux/macOS):
   - Coloque copimais.jar na mesma pasta que run.sh, torne o script executável (chmod +x run.sh) e execute ./run.sh

Observações para distribuição ao usuário final
- É possível distribuir apenas o copimais.jar e os scripts run.bat/run.sh. O usuário precisará ter Java 17 instalado.
- Para evitar exigir Java no sistema do usuário, inclua uma JRE dentro da pasta (nomeada jre/) e os scripts já tentam usar jre/bin/java antes do java no PATH.
- Para gerar uma distribuição nativa com o ícone do CopiMais, execute `package.bat` no Windows. O resultado padrão é `dist_package\CopiMais\CopiMais.exe`. Para gerar um instalador `.exe`, execute `package.bat exe` (o WiX Toolset precisa estar instalado).

Configurações importantes
- Banco de dados: um arquivo SQLite será criado em: ${user.home}/copimais-app/dados.db
- Usuário inicial: DatabaseSeeder cria um usuário "admin" com senha "admin123" na primeira execução (ver DatabaseSeeder.java).
- A frontend agora usa, por padrão, '/api' como baseURL. Para apontar para outro backend em tempo de execução, definir a variável de ambiente VITE_API_URL antes do build do frontend (ex.: VITE_API_URL="https://meu-servidor:8080/api").

Segurança / Produção
- Revise o SecurityConfig e CORS antes de expor a aplicação à Internet. O projeto atualmente tem CORS bastante permissivo para facilitar desenvolvimento.
- Considere habilitar HTTPS e ajustar política de sessão/cookies para produção.

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

Ajuda / Próximos passos recomendados
- (Opcional) Gerar instaladores nativos com jpackage para Windows/macOS/Linux.
- Revisar e reforçar regras de segurança (endpoints protegidos, CORS, HTTPS).
- Adicionar backup/rotina de migração do arquivo dados.db.

Se quiser, posso:
- Commitar essas mudanças em uma branch e criar um README mais detalhado com imagens ou passos de empacotamento com jpackage.
- Gerar um script que automaticamente copie e renomeie o jar para distribuição.

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>