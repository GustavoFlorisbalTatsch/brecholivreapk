DOCUMENTAÇÃO BRECHO LIVRE 
1.	PARTE ESCRITA: DEFINIÇÃO DA PROPOSTA
1.1 Problema Atual Identificado
O modelo linear de consumo contemporâneo incentiva a aquisição impulsiva e o descarte precoce de bens duráveis e semiduráveis (como vestuário, eletrônicos e utilitários domésticos). Esse comportamento gera um volume crítico de resíduos sólidos e poluição ambiental, ignorando o fato de que bilhões de toneladas de materiais descartados anualmente retêm valor prático e funcional. Paralelamente, há uma carência de mecanismos locais integrados que facilitem a reinserção desses itens na economia ativa de forma ágil e segura.
1.2 Contexto e Público Afetado
O projeto se contextualiza na Economia Circular e nas metas estipuladas pelo Objetivo de Desenvolvimento Sustentável número 12 da Organização das Nações Unidas (ODS 12 - Consumo e Produção Responsáveis). O público afetado compreende cidadãos que necessitam esvaziar espaços residenciais de itens subutilizados, pessoas que buscam adquirir produtos de qualidade por valores abaixo do mercado tradicional, e consumidores conscientes focados na redução de pegada ecológica.
1.3 Justificativa
A reutilização de bens constitui uma das estratégias mais eficientes para mitigar a exploração de recursos naturais e frear o acúmulo de lixo urbano. O desenvolvimento de uma ferramenta móvel dedicada simplifica o processo de desapego, transformando o descarte em oportunidade de renda extra para o vendedor e economia real para o comprador, além de promover a educação e engajamento ambiental prático na comunidade escolar ou regional.
1.4 Proposta de Solução e Nome da Aplicação
A solução proposta consiste no desenvolvimento do Brechó Livre, um aplicativo mobile autoral que funciona como uma vitrine de anúncios digitais para comércio e troca de produtos usados. A plataforma centraliza transações diretas entre membros cadastrados, priorizando a usabilidade e a arquitetura segura de dados necessária para interações comunitárias.
1.5 Tipos de Usuário e Permissões Iniciais
Para cumprir com o requisito de arquitetura multinível com controle de acesso, o sistema é estruturado em dois perfis distintos:
•	Perfil Cliente (Comum): Destinado a consumidores que realizam a busca, visualização e manifestação de interesse nos itens anunciados. Permissões de leitura no back-end para listagem geral e detalhes de produtos.
•	Perfil Anunciante (Vendedor): Além dos direitos de visualização do cliente, possui autorização para gerenciar o ciclo de vida completo de seus próprios anúncios. Permissões completas de escrita, edição e remoção restritas aos seus registros.
•	Autenticação de Usuários: Registro inicial e validação de credenciais de acesso.

1.6 Principais Funcionalidades
•	Segurança via JWT: Mecanismo de persistência de credenciais e segurança de rotas com base em Bearer Token.
•	Operações CRUD de Produtos: Criação, leitura, atualização e exclusão de itens anunciados (Exclusivo do Anunciante).
•	Navegação e Busca Dinâmica: Filtros refinados e busca por categorias de desapego.

1.7	Telas Previstas e Fluxo Inicial de Navegação
O esqueleto navegável da aplicação contempla três interfaces estruturais básicas interconectadas por rotas sequenciais:
•	Tela 1 - Login / Autenticação: Formulário de entrada com campos para e-mail e senha, possuindo um gatilho de navegação para direcionar o usuário à vitrine principal após autenticação.
•	Tela 2 - Vitrine Central (Home): Dashboard central com disposição visual em formato de grid ou lista exibindo cards de produtos disponíveis no Brechó.
•	Tela 3 - Detalhes do Produto / Novo Anúncio: Exibição de metadados do produto selecionado (título, preço, descrição, dados de contato) com formulário alternativo para inclusão de novos anúncios.
Fluxo: Tela de Login —(Ação de Cadastro/Login)—> Tela Vitrine Central —(Seleção de Card)—>Tela de Detalhes
