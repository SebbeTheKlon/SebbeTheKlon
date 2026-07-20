# Arbetsflöde för detta repo

- Efter varje kodningssession (när ändringar har committats och pushats till
  arbetsgrenen): öppna automatiskt en pull request mot `main` och merga den
  direkt, utan att fråga om bekräftelse först. Använd tydliga svenska
  titlar/beskrivningar i samma stil som tidigare PR:ar i repot.
- Om det redan finns en öppen PR för samma gren, uppdatera/merga den i
  stället för att skapa en ny.
- Skippa detta steg endast om användaren explicit ber om att INTE merga än,
  eller om det uppstår mergekonflikter som kräver ett beslut från
  användaren — fråga då innan du går vidare.
