# Kodgranskning: föreslagna aktiviteter

Granskningen omfattar de gemensamma JavaScript-filerna, registret över
demonstrationer, kategorisidorna och projektets befintliga dokumentation.
Nedan finns fyra avgränsade aktiviteter, en per efterfrågad problemtyp.

## 1. Stavfel: ersätt ”repot” i favoritpanelen

**Problem:** Favoritpanelens hjälptext och statusmeddelande använder ordet
”repot”. Det är en tveksam försvenskning och avviker från ett vårdat svenskt
gränssnitt. Förekomsten finns både i knappens `title` och i meddelandet som
visas när synkningen inte gav några nya favoriter.

**Aktivitet:** Ersätt ”repot” med ”kodarkivet” i `js/favs.js` och använd samma
term i den närliggande kommentaren. Kontrollera samtidigt att alla tre
synkmeddelanden fortfarande är korta och konsekventa.

**Klart när:** Ingen förekomst av `repot` återstår och favoritpanelens texter
använder ”kodarkivet” konsekvent.

## 2. Bugg: ogiltigt solo-id ger en tom lightbox

**Problem:** `js/main.js` aktiverar klassen `solo-mode` innan skriptet har
kontrollerat att värdet i `?solo=` motsvarar en demo. Om länken exempelvis är
`bakgrund.html?solo=fx-99` hittas inget mål, men sidans vanliga innehåll döljs
ändå. Resultatet blir en tom sida eller lightbox i stället för ett begripligt
reservläge.

**Aktivitet:** Slå endast på `solo-mode` och `solo-scroll` när
`document.getElementById(solo)` returnerar en faktisk `.demo`. Låt en ogiltig
parameter visa den vanliga kategorisidan (alternativt ett tydligt
felmeddelande) och säkerställ att menyknappen då skapas som vanligt.

**Klart när:** Ett giltigt `?solo=fx-NN` beter sig oförändrat, medan ett
ogiltigt id inte längre lämnar sidan tom.

## 3. Dokumentationsavvikelse: README beskriver inte projektet

**Problem:** `README.md` innehåller fortfarande GitHubs generiska mall för en
profil-README. Den beskriver varken Effektverkstan, hur de statiska sidorna
förhandsvisas eller registrets roll. Det avviker tydligt från den faktiska
arkitekturen som beskrivs i `CLAUDE.md` och gör projektets publika ingång
missvisande.

**Aktivitet:** Ersätt profilmallen med en kort projekt-README på svenska:
projektets syfte, hur `index.html` eller en lokal statisk server används,
översikt över `css/`, `js/` och kategorisidorna samt instruktionen att
`js/registry.js` ska uppdateras när en demo läggs till eller byter namn.

**Klart när:** En ny utvecklare kan starta webbplatsen och hitta rätt ställe
för att registrera en demo utan att först läsa den agentspecifika
`CLAUDE.md`-filen.

## 4. Testförbättring: lägg till ett beroendefritt integritetstest

**Problem:** Projektet saknar automatiserade tester. Ett vanligt och
svårupptäckt fel är därför att `js/registry.js`, en kategorisidas `.nr`-element
och dess `/* --- NN */`-markörer glider isär. Då kan galleri, favoriter,
lightbox eller ”Visa koden” visa fel eller ofullständigt innehåll trots att all
JavaScript är syntaktiskt giltig.

**Aktivitet:** Lägg till ett litet Node-test utan externa paket, exempelvis
`tests/registry-integrity.test.js`, som för varje registerpost verifierar att
kategorisidan finns, att exakt en demo har motsvarande nummer och att CSS- och
JavaScript-markörerna följer projektets konvention. Testet bör också rapportera
demos som finns i HTML men saknas i registret. Dokumentera ett enda kommando
för att köra testet i `README.md`.

**Klart när:** Testet avslutas med status 0 för dagens kodbas, ger ett
handlingsbart fel med filnamn och demonummer vid en avvikelse och kan köras med
den Node-version som redan används för `node --check`.

