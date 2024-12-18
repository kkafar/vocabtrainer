Jak powinna działać strona z kartkami?

Pobrane karki trzymasz sobie w cards/layout. cards/learn/page jest komponentem, który fetchuje sobie wszystkie karki i trzyma logikę dot. wyboru "kolejnej kartki".

Przy ruchu "forward" po prostu aktualizujemy stan komponentu, trigerrujemy rerender i pokazujemy kolejną kartkę. 

Przy ruchu "backward" mamy to samo, tylko pokazujemy poprzednią kartkę ==> nasz algortym musi być odwracalny / trzymać historię kartek. 

Jeżeli kliknięty jest `edit` to nawigujemy do strony `cards/edit/[id]`, gdzie edytujemy dany VocabItem i po submicie chcemy wrócić do kartki, z której 
przenawigowaliśmy do edycji. Pytanie teraz jak to zrealizować. 

Problem przed jakim stajemy, to fakt, że przy nawigacji do `cards/edit/[id]` komponent `cards/learn/page` został odmontowany => stracił stan!
Więc jeżeli tam obsługujemy algorytm selekcji to musimy to jakoś odtworzyć. 

Wydaje mi się, że najprościej będzie przechowywać stan tego algorytmu po prostu w session storage. Jeżeli mamy nawigować do edycji, 
to najpierw zapisujemy wszelki stan potrzebny do wznowienia algorytmu w session storage, a dopiero później nawigujemy dalej. 

Ze strony `cards/edit/[id]` nawigujemy po prostu na endpoint `cards/learn`, który odczytuje sobie zapisany stan z session storage i dzięki temu możemy kontynuować naukę. 


# Projekt kartki

Po pierwsze - pozycjonowanie kartki powinno być niezależne od jej wyglądu. 

## Gdzie fetchować dane? 

Jako, że chcę wyświetlić fallback w odpowiednim miejscu to komponent pozycjonujący kartkę powinien być 
powyżej samej kartki.

Potem powinien być komponent wyświetlający kartkę albo fallback tej kartki. 

Komponent wyświetlający kartkę też może być podzielony na jeszcze 2 poziomy abstrakcji - fetch danych i wyświetlenie samego komponentu!

Komponent pozycjonujący kartkę nie jest sprawą samej kartki --> to powinno żyć w jakimś layout'cie albo na poziomie page'a.

Gdzie powinny żyć przyciski? Jeszcze nie jestem pewien.

## Jakie dane trzymamy / jakie funkcjonalności chcemy. 

1. [ ] Te kartki, które już są. 
2. [ ] Chcę móc wybrać jakich słów się uczę - na podstawie grupy np. tylko warzywa i owoce, albo tylko dom, przyimki, itd. 
3. [ ] Wobec tego każdy item może mieć grupę (np. lekcja, dodatkowe, albo null - może nie być grupy ^)
4. [ ] każdy item powinien mieć kategorię, bądź być nieskategoryzowany - myślę, że to powinno być coś w stylu słownictwo / gramatyka.
5. [ ] Każdy item powinien mieć datę dodania,
6. [ ] Każdy item powinien mieć tłumaczenie,
7. [ ] Każdy item powinien mieć swój tekst,
8. [ ] Każdy item powinien mieć statystyki - ile razy było "got it", ile razy było "repeat",
9. [ ] Powinna być możliwość zalogowania się! Statystyki powinny być śledzone dla danego użytkownika,
10. [ ] Powinna być możliwość przeglądania słów po grupie / kategori,
11. [ ] Powinna byc możliwość dodawania / usuwania grup
12. [ ] Powinna być możliwość dodawania / usuwania słownictwa (vocab item)
13. [ ] Powinna być możliwość zmieniania grup dla słownictwa
14. [ ] Myślę, że jedno słowo powinno móc należeć do więcej niż jednej grupy
15. [ ] Grupa powinna mieć nazwę, opis (nullable), id, datę stworzenia, last update time, ewentualnie awatar / zdjęcie (późniejszy okres)
16. [ ] Użytkownik powinien mieć nazwę użytkownika, hasło, awatar. 
17. [ ] Powinna być możliwość zmiany nazwy użytkownika, hasła, awataru.
18. [ ] Powinna być możliwość resetu statystyk dla danej grupy dla danego użytkownika
19. [ ] Powinna być możliwość zapisu sesji - tzn. - jeżeli jesteś w trakcie nauki to możesz zamknąć sobie przeglądarkę
    i po ponownym otwarciu wrócisz do tego stanu, który miałeś. 
20. [ ] Chcę mieć kartki w dwóch językach - jeżeli jest tłumaczenie to powinny być też kartki z tekstem po polsku i tłumaczeniem po niemiecku
21. [ ] Potencjalnie moglibyśmy wspierać więcej niż jeden język - więc każde słowo powinno mieć przypisany kod języka


Obsługę użytkowników można dodać na końcu - w tym momencie tego nie potrzebuję, ponieważ projektu używam tylko ja. 

Myślę, że powinien być jakiś limit na dopuszczalną liczbę słów, żeby mi ktoś nie wstawił milionów takowych w przyszłości, jeżeli gdziekolwiek to udostępnię. 

### Jak powinna w takim razie wyglądać baza danych


#### Opcjonalnie - tabela użytkowników

name: user
attributes:
    * id: not-null, integer, primary-key
    * username: not-null, string,
    * hashed_password: not-null, ??
    * created_date: not-null, date // account creation date

#### Definicje słownictwa

name: vocabulary
attributes:
    * id: not-null, integer, primary-key
    * text: not-null, string
    * translation: nullable, string
    * created_date: not-null, date
    * last_updated_date: not-null, date
    * (optional) category_id: nullable, integer, foreign-key category (id) (THIS SHOULD BE IN SEPARATE TABLE)

#### Definicje grup

name: group
attributes:
    * id: not-null, integer, primary-key
    * name: not-null, text, unique
    * description: nullable, text
    * created_date: not-null, date

#### Opcjonalnie - Definicje kategorii

name: category
attributes:
    * id: not-null, integer, primary-key
    * name: not-null, text, unique
    * description: nullable, text
    * created_date: not-null, date


#### Relacja przynależności słownictwa do grupy

name: vocabulary_grouping
attributes:
    * item_id: not-null, integer, primary-key, foreign-key vocabulary (id) // vocabulary item id, but it should be more general - I would need to handle grammar etc.
    * group_id: not-null, integer, primary-key, foreign-key group (id)

#### Opcjonalnie - Relacja przynależności słownictwa do kategorii ???

WIP WIP

#### Relacja statystyk dla słownictwa

name: vocabulary_stats
attributes:
    * item_id: not-null, integer, primary-key, foreign-key vocabulary (id)
    * reversed: not-null, boolean, primary-key // german -> polish (0) or polish -> german (1) (THIS IS BAD FOR SCALING FOR MORE LANGUAGES - MAYBE LANGUAGE PAIR)
    * hit_count: not-null, integer // number of times the item was marked as "learned"
    * miss_count: not-null, integer // number of times the item was marked as "not-yet-learned"

#### Game session representation

For now the session tracks current in game (card game) progress, so that the player can resume after restarting the browser

name: game_session
attributes:
    * id: not-null, integer, primary-key (uuid or autoincrement)
    * start_date: not-null, date // should decide on date locale
    * expiration_date: nullable, date
    * description: nullable, text // user defined game session description

#### Session info

To resume the game I need all the data that defines a game.

The game is defined by:
    * vocabulary list, 
    * "learned" vocablary, 
    * current item.

I can either store all the considered vocabulary ids for given session - I think it is acceptable.
Or if we limit the game model to work only for vocabulary groups - we could store only the group - but this approach would collide with the idea
of losely selecting the vocabulary for given game. 

name: game_session_items
attributes:
    * session_id: not-null, integer, primary-key, foreign-key game_session (id)
    * item_id: not-null, integer, primary-key, foreign-key vocabulary (id)
    * learned: not-null, boolean, 
    * ordering: not-null, integer // used for sorting when restoring the session, I think this just could be an index

name: game_session_current_item
attributes:
    * session_id: not-null, integer, primary-key, foreign-key game_session (id)
    * item_id: not-null, integer, primary-key, foreign-key vocabulary (id) // id of current item in session


The game state should only be saved on explicit user request (to persistent data base).
The game state might be saved to local browser storage on more frequent basis.

