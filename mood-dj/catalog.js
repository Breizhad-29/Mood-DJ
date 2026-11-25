// Mood DJ — catalogue intégré.
// Une ligne par titre : Artiste|Titre|style|sous-style|énergie (1-5)|année|drapeaux
// Drapeaux : j = joyeux, r = romantique, m = mélancolique, n = nostalgique,
//            i = instrumental, d = dansant.
// Pour ajouter un titre, il suffit d'ajouter une ligne au même format.
/* eslint-disable */
var MDJ_CATALOG_RAW = String.raw`
Fleetwood Mac|Dreams|rock|soft|2|1977|m
Fleetwood Mac|Landslide|rock|soft|1|1975|mn
Eagles|Take It Easy|rock|soft|3|1972|j
Eagles|Peaceful Easy Feeling|rock|soft|2|1972|jr
America|A Horse with No Name|rock|soft|2|1971|n
America|Ventura Highway|rock|soft|3|1972|j
Toto|Africa|rock|soft|3|1982|nj
Chicago|If You Leave Me Now|rock|soft|2|1976|rm
Christopher Cross|Sailing|rock|soft|1|1979|r
Bread|Everything I Own|rock|soft|2|1972|r
Supertramp|Breakfast in America|rock|soft|3|1979|j
Supertramp|The Logical Song|rock|soft|3|1979|n
Dire Straits|Romeo and Juliet|rock|soft|2|1980|rm
Cat Stevens|Wild World|rock|soft|2|1970|m
Elton John|Tiny Dancer|rock|soft|2|1971|rn
Elton John|Your Song|rock|soft|1|1970|r
Phil Collins|Another Day in Paradise|rock|soft|2|1989|m
Billy Joel|Piano Man|rock|soft|2|1973|n
Bryan Adams|Heaven|rock|soft|2|1984|r
Bonnie Tyler|Total Eclipse of the Heart|rock|soft|3|1983|rm
REO Speedwagon|Can't Fight This Feeling|rock|soft|2|1984|r
Foreigner|I Want to Know What Love Is|rock|soft|2|1984|r
Steve Miller Band|Fly Like an Eagle|rock|soft|2|1976|n
The Doobie Brothers|What a Fool Believes|rock|soft|3|1978|j
Tom Petty|Runnin' Down a Dream|rock|classic|4|1989|
Tom Petty|Free Fallin'|rock|classic|2|1989|n
Tom Petty|I Won't Back Down|rock|classic|3|1989|
Bruce Springsteen|Born to Run|rock|classic|5|1975|
Bruce Springsteen|Dancing in the Dark|rock|classic|4|1984|jd
Creedence Clearwater Revival|Up Around the Bend|rock|classic|4|1970|j
Creedence Clearwater Revival|Fortunate Son|rock|classic|4|1969|
Creedence Clearwater Revival|Have You Ever Seen the Rain|rock|classic|3|1970|m
Creedence Clearwater Revival|Who'll Stop the Rain|rock|classic|3|1970|m
The Rolling Stones|Paint It Black|rock|classic|4|1966|
The Rolling Stones|(I Can't Get No) Satisfaction|rock|classic|4|1965|d
The Rolling Stones|Gimme Shelter|rock|classic|4|1969|
The Beatles|Come Together|rock|classic|3|1969|
The Beatles|Here Comes the Sun|rock|classic|2|1969|j
The Doors|Riders on the Storm|rock|classic|2|1971|m
The Doors|Roadhouse Blues|rock|classic|4|1970|
Eagles|Hotel California|rock|classic|3|1976|m
Dire Straits|Sultans of Swing|rock|classic|3|1978|n
Dire Straits|Walk of Life|rock|classic|4|1985|jd
Fleetwood Mac|Go Your Own Way|rock|classic|4|1977|
Steppenwolf|Born to Be Wild|rock|classic|5|1968|
Queen|Don't Stop Me Now|rock|classic|5|1978|jd
Queen|Bohemian Rhapsody|rock|classic|4|1975|
David Bowie|Heroes|rock|classic|4|1977|
The Who|Baba O'Riley|rock|classic|4|1971|
Bob Seger|Night Moves|rock|classic|3|1976|n
Bob Seger|Against the Wind|rock|classic|3|1980|n
Jackson Browne|Running on Empty|rock|classic|4|1977|
The Doobie Brothers|Long Train Runnin'|rock|classic|4|1973|d
Tom Cochrane|Life Is a Highway|rock|classic|5|1991|j
Boston|More Than a Feeling|rock|classic|4|1976|n
Led Zeppelin|Stairway to Heaven|rock|classic|3|1971|
Pink Floyd|Wish You Were Here|rock|prog|2|1975|m
Pink Floyd|Comfortably Numb|rock|prog|3|1979|m
The Kinks|You Really Got Me|rock|classic|5|1964|
Neil Young|Heart of Gold|rock|classic|2|1972|m
Neil Young|Rockin' in the Free World|rock|classic|5|1989|
Bryan Adams|Summer of '69|rock|classic|5|1984|jn
John Mellencamp|Jack & Diane|rock|classic|3|1982|n
The Police|Every Breath You Take|rock|classic|3|1983|r
U2|With or Without You|rock|classic|3|1987|r
U2|Where the Streets Have No Name|rock|classic|4|1987|
AC/DC|Highway to Hell|rock|hard|5|1979|
AC/DC|Back in Black|rock|hard|5|1980|
AC/DC|Thunderstruck|rock|hard|5|1990|
AC/DC|T.N.T.|rock|hard|5|1975|
Guns N' Roses|Sweet Child O' Mine|rock|hard|4|1987|
Guns N' Roses|Welcome to the Jungle|rock|hard|5|1987|
Guns N' Roses|November Rain|rock|hard|3|1991|rm
Guns N' Roses|Paradise City|rock|hard|5|1987|
Led Zeppelin|Whole Lotta Love|rock|hard|5|1969|
Led Zeppelin|Immigrant Song|rock|hard|5|1970|
Deep Purple|Smoke on the Water|rock|hard|4|1972|
Deep Purple|Highway Star|rock|hard|5|1972|
ZZ Top|La Grange|rock|hard|4|1973|
ZZ Top|Sharp Dressed Man|rock|hard|4|1983|d
Aerosmith|Dream On|rock|hard|3|1973|m
Aerosmith|Walk This Way|rock|hard|5|1975|d
Van Halen|Jump|rock|hard|5|1984|j
Van Halen|Panama|rock|hard|5|1984|
Bon Jovi|Livin' on a Prayer|rock|hard|5|1986|
Bon Jovi|Wanted Dead or Alive|rock|hard|3|1986|
Def Leppard|Pour Some Sugar on Me|rock|hard|5|1987|d
Scorpions|Rock You Like a Hurricane|rock|hard|5|1984|
Scorpions|Still Loving You|rock|hard|2|1984|rm
Kiss|Rock and Roll All Nite|rock|hard|5|1975|j
Black Sabbath|Paranoid|rock|hard|5|1970|
Thin Lizzy|The Boys Are Back in Town|rock|hard|4|1976|j
Mötley Crüe|Kickstart My Heart|rock|hard|5|1989|
Whitesnake|Here I Go Again|rock|hard|4|1987|
Lynyrd Skynyrd|Sweet Home Alabama|rock|sudiste|4|1974|j
Lynyrd Skynyrd|Free Bird|rock|sudiste|3|1973|m
Lynyrd Skynyrd|Simple Man|rock|sudiste|2|1973|m
Lynyrd Skynyrd|Gimme Three Steps|rock|sudiste|4|1973|
Lynyrd Skynyrd|Tuesday's Gone|rock|sudiste|2|1973|m
The Allman Brothers Band|Ramblin' Man|rock|sudiste|4|1973|j
The Allman Brothers Band|Midnight Rider|rock|sudiste|4|1970|
The Allman Brothers Band|Jessica|rock|sudiste|4|1973|i
The Allman Brothers Band|Melissa|rock|sudiste|2|1972|r
ZZ Top|Tush|rock|sudiste|4|1975|
Molly Hatchet|Flirtin' with Disaster|rock|sudiste|5|1979|
The Marshall Tucker Band|Can't You See|rock|sudiste|3|1973|
The Charlie Daniels Band|The Devil Went Down to Georgia|rock|sudiste|5|1979|d
Blackfoot|Highway Song|rock|sudiste|4|1979|
38 Special|Hold On Loosely|rock|sudiste|4|1981|
The Black Crowes|Hard to Handle|rock|sudiste|4|1990|d
The Black Crowes|She Talks to Angels|rock|sudiste|2|1990|m
Outlaws|Green Grass and High Tides|rock|sudiste|4|1975|
Blackberry Smoke|One Horse Town|rock|sudiste|3|2012|n
Whiskey Myers|Stone|rock|sudiste|3|2016|m
The Killers|Mr. Brightside|rock|inde|5|2004|d
The Killers|When You Were Young|rock|inde|5|2006|
Arctic Monkeys|Do I Wanna Know?|rock|inde|3|2013|
Arctic Monkeys|R U Mine?|rock|inde|4|2012|
The Strokes|Last Nite|rock|inde|4|2001|
The White Stripes|Seven Nation Army|rock|inde|4|2003|
Kings of Leon|Sex on Fire|rock|inde|4|2008|
Kings of Leon|Use Somebody|rock|inde|3|2008|m
The Black Keys|Lonely Boy|rock|inde|5|2011|d
The Black Keys|Gold on the Ceiling|rock|inde|4|2011|
Franz Ferdinand|Take Me Out|rock|inde|5|2004|d
Arcade Fire|Wake Up|rock|inde|4|2004|
Radiohead|Karma Police|rock|inde|2|1997|m
Radiohead|Creep|rock|grunge|3|1992|m
Oasis|Wonderwall|rock|inde|3|1995|n
Oasis|Don't Look Back in Anger|rock|inde|3|1995|n
Blur|Song 2|rock|inde|5|1997|
Foo Fighters|Everlong|rock|grunge|5|1997|
Foo Fighters|Learn to Fly|rock|inde|4|1999|j
Red Hot Chili Peppers|Californication|rock|inde|3|1999|m
Red Hot Chili Peppers|Can't Stop|rock|inde|4|2002|
Red Hot Chili Peppers|Scar Tissue|rock|inde|2|1999|m
Nirvana|Smells Like Teen Spirit|rock|grunge|5|1991|
Pearl Jam|Alive|rock|grunge|4|1991|
Muse|Uprising|rock|inde|4|2009|
Muse|Starlight|rock|inde|4|2006|j
Tame Impala|The Less I Know the Better|rock|inde|3|2015|d
Cage the Elephant|Ain't No Rest for the Wicked|rock|inde|4|2008|
John Denver|Take Me Home, Country Roads|country|balade|3|1971|nj
Willie Nelson|Blue Eyes Crying in the Rain|country|balade|1|1975|m
Willie Nelson|Always on My Mind|country|balade|1|1982|rm
Dolly Parton|Jolene|country|balade|3|1973|m
Dolly Parton|I Will Always Love You|country|balade|1|1974|rm
Patsy Cline|Crazy|country|balade|1|1961|rm
Johnny Cash|Hurt|country|balade|1|2002|m
Glen Campbell|Wichita Lineman|country|balade|2|1968|m
Kenny Rogers|The Gambler|country|balade|2|1978|n
Kenny Rogers|Islands in the Stream|country|balade|3|1983|rj
Chris Stapleton|Tennessee Whiskey|country|balade|2|2015|r
Chris Stapleton|Starting Over|country|balade|2|2020|j
Zach Bryan|Something in the Orange|country|balade|2|2022|m
Tyler Childers|Lady May|country|balade|1|2017|r
Jason Isbell|Cover Me Up|country|balade|1|2013|r
Kacey Musgraves|Slow Burn|country|balade|2|2018|r
Alan Jackson|Remember When|country|balade|1|2003|rn
Garth Brooks|The Dance|country|balade|1|1989|m
Randy Travis|Forever and Ever, Amen|country|balade|2|1987|r
George Strait|Amarillo by Morning|country|balade|2|1982|n
Brad Paisley|Whiskey Lullaby|country|balade|1|2004|m
Luke Combs|Fast Car|country|balade|2|2023|n
Shania Twain|You're Still the One|country|balade|2|1997|r
Lady A|Need You Now|country|balade|2|2009|rm
Brooks & Dunn|Boot Scootin' Boogie|country|dance|5|1992|dj
Billy Ray Cyrus|Achy Breaky Heart|country|dance|5|1992|dj
Shania Twain|Man! I Feel Like a Woman!|country|dance|5|1997|dj
Shania Twain|That Don't Impress Me Much|country|dance|4|1997|dj
Alan Jackson|Chattahoochee|country|dance|5|1993|dj
Garth Brooks|Friends in Low Places|country|dance|4|1990|jd
Big & Rich|Save a Horse (Ride a Cowboy)|country|dance|5|2004|dj
Blake Shelton|Boys 'Round Here|country|dance|4|2013|dj
Florida Georgia Line|Cruise|country|dance|4|2012|dj
Luke Bryan|Country Girl (Shake It for Me)|country|dance|5|2011|dj
Lil Nas X|Old Town Road|country|dance|4|2019|dj
Beyoncé|Texas Hold 'Em|country|dance|4|2024|dj
Dolly Parton|9 to 5|country|dance|4|1980|dj
Brooks & Dunn|Neon Moon|country|dance|3|1991|dm
Gretchen Wilson|Redneck Woman|country|dance|4|2004|dj
Toby Keith|Should've Been a Cowboy|country|dance|4|1993|jd
Morgan Wallen|Whiskey Glasses|country|dance|4|2018|d
Zac Brown Band|Chicken Fried|country|dance|3|2008|j
Rednex|Cotton Eye Joe|country|dance|5|1994|dj
Morgan Wallen|Last Night|country|moderne|3|2023|
Morgan Wallen|Wasted on You|country|moderne|3|2021|m
Luke Combs|Beautiful Crazy|country|moderne|2|2018|r
Luke Combs|When It Rains It Pours|country|moderne|4|2017|j
Lainey Wilson|Watermelon Moonshine|country|moderne|3|2023|n
Lainey Wilson|Heart Like a Truck|country|moderne|3|2022|
Zach Bryan|Heading South|country|moderne|3|2019|
Eric Church|Springsteen|country|moderne|3|2011|n
Kacey Musgraves|Follow Your Arrow|country|moderne|3|2013|j
Kacey Musgraves|Butterflies|country|moderne|3|2018|r
Chris Stapleton|Parachute|country|moderne|4|2015|
Thomas Rhett|Die a Happy Man|country|moderne|2|2015|r
Carrie Underwood|Before He Cheats|country|moderne|4|2006|
Keith Urban|Somebody Like You|country|moderne|4|2002|j
Kenny Chesney|No Shoes, No Shirt, No Problems|country|moderne|3|2002|j
Miranda Lambert|The House That Built Me|country|moderne|2|2010|n
Jelly Roll|Need a Favor|country|moderne|3|2023|
Kane Brown|Heaven|country|moderne|2|2017|r
Luke Bryan|Play It Again|country|moderne|4|2014|j
Jason Aldean|Dirt Road Anthem|country|moderne|3|2010|
Dan + Shay|Speechless|country|moderne|2|2018|r
Bailey Zimmerman|Rock and A Hard Place|country|moderne|3|2022|m
Waylon Jennings|Luckenbach, Texas (Back to the Basics of Love)|country|outlaw|2|1977|n
Waylon Jennings|Mammas Don't Let Your Babies Grow Up to Be Cowboys|country|outlaw|2|1978|n
Willie Nelson|On the Road Again|country|outlaw|4|1980|j
Johnny Cash|Folsom Prison Blues|country|outlaw|4|1955|
Johnny Cash|I Walk the Line|country|outlaw|3|1956|
Johnny Cash|Ring of Fire|country|outlaw|4|1963|j
Johnny Cash|I've Been Everywhere|country|outlaw|4|1996|j
The Highwaymen|Highwayman|country|outlaw|2|1985|n
Merle Haggard|Mama Tried|country|outlaw|3|1968|n
Kris Kristofferson|Me and Bobby McGee|country|outlaw|2|1970|n
Sturgill Simpson|Long White Line|country|outlaw|4|2014|
Sturgill Simpson|Turtles All the Way Down|country|outlaw|2|2014|
Tyler Childers|Feathered Indians|country|outlaw|3|2017|r
Tyler Childers|All Your'n|country|outlaw|3|2019|r
Jason Isbell|24 Frames|country|outlaw|3|2015|
Dwight Yoakam|Fast as You|country|outlaw|4|1993|
Dwight Yoakam|Guitars, Cadillacs|country|outlaw|4|1986|
Shooter Jennings|4th of July|country|outlaw|3|2005|n
Colter Wall|Kate McCannon|country|outlaw|2|2017|m
Hank Williams Jr.|Family Tradition|country|outlaw|4|1979|
David Allan Coe|You Never Even Called Me by My Name|country|outlaw|3|1975|j
Townes Van Zandt|Pancho and Lefty|country|outlaw|1|1972|m
Steve Earle|Copperhead Road|country|outlaw|4|1988|
Charley Crockett|Welcome to Hard Times|country|outlaw|2|2020|m
Dua Lipa|Levitating|pop|actuelle|4|2020|dj
Dua Lipa|Don't Start Now|pop|actuelle|4|2019|d
The Weeknd|Blinding Lights|pop|actuelle|5|2019|d
The Weeknd|Save Your Tears|pop|actuelle|4|2020|d
Harry Styles|As It Was|pop|actuelle|4|2022|m
Harry Styles|Watermelon Sugar|pop|actuelle|4|2019|j
Taylor Swift|Shake It Off|pop|actuelle|5|2014|jd
Taylor Swift|Anti-Hero|pop|actuelle|3|2022|
Ed Sheeran|Shape of You|pop|actuelle|4|2017|d
Ed Sheeran|Perfect|pop|actuelle|2|2017|r
Billie Eilish|bad guy|pop|actuelle|3|2019|
Billie Eilish|Birds of a Feather|pop|actuelle|3|2024|r
Adele|Rolling in the Deep|pop|actuelle|4|2010|
Adele|Someone Like You|pop|actuelle|1|2011|m
Mark Ronson|Uptown Funk|pop|actuelle|5|2014|dj
Bruno Mars|Just the Way You Are|pop|actuelle|3|2010|r
Miley Cyrus|Flowers|pop|actuelle|3|2023|j
Coldplay|Viva la Vida|pop|actuelle|4|2008|j
Coldplay|A Sky Full of Stars|pop|actuelle|4|2014|dj
Imagine Dragons|Believer|pop|actuelle|5|2017|
OneRepublic|Counting Stars|pop|actuelle|4|2013|
Pharrell Williams|Happy|pop|actuelle|4|2013|jd
Sabrina Carpenter|Espresso|pop|actuelle|4|2024|d
Lewis Capaldi|Someone You Loved|pop|actuelle|1|2018|m
Sia|Chandelier|pop|actuelle|4|2014|
Hozier|Take Me to Church|pop|actuelle|3|2013|
Michael Jackson|Billie Jean|pop|8090|4|1982|d
Michael Jackson|Beat It|pop|8090|5|1982|d
Madonna|Like a Prayer|pop|8090|4|1989|d
Madonna|Holiday|pop|8090|4|1983|dj
Whitney Houston|I Wanna Dance with Somebody (Who Loves Me)|pop|8090|5|1987|dj
Cyndi Lauper|Girls Just Want to Have Fun|pop|8090|5|1983|dj
a-ha|Take On Me|pop|synth|5|1984|jdn
Tears for Fears|Everybody Wants to Rule the World|pop|synth|3|1985|n
Wham!|Wake Me Up Before You Go-Go|pop|8090|5|1984|dj
George Michael|Careless Whisper|pop|8090|2|1984|rn
Eurythmics|Sweet Dreams (Are Made of This)|pop|synth|4|1983|d
Duran Duran|Hungry Like the Wolf|pop|8090|4|1982|d
Prince|Purple Rain|pop|8090|2|1984|m
Prince|Kiss|pop|8090|4|1986|d
Lionel Richie|All Night Long (All Night)|pop|8090|4|1983|dj
Phil Collins|In the Air Tonight|pop|8090|3|1981|m
Simple Minds|Don't You (Forget About Me)|pop|8090|4|1985|n
Spandau Ballet|True|pop|8090|2|1983|r
Britney Spears|...Baby One More Time|pop|8090|4|1998|d
Backstreet Boys|I Want It That Way|pop|8090|3|1999|r
Spice Girls|Wannabe|pop|8090|5|1996|dj
Ace of Base|All That She Wants|pop|8090|4|1992|d
Roxette|It Must Have Been Love|pop|8090|2|1990|rm
Céline Dion|My Heart Will Go On|pop|8090|2|1997|r
Mariah Carey|Fantasy|pop|8090|4|1995|d
No Doubt|Don't Speak|pop|8090|2|1995|m
The Cranberries|Linger|pop|8090|2|1993|r
Daft Punk|One More Time|electro|house|5|2000|dj
Daft Punk|Around the World|electro|house|4|1997|d
Daft Punk|Get Lucky|electro|house|4|2013|dj
Stardust|Music Sounds Better with You|electro|house|4|1998|dj
Avicii|Levels|electro|house|5|2011|dj
Avicii|Wake Me Up|electro|house|4|2013|j
Swedish House Mafia|Don't You Worry Child|electro|house|4|2012|
David Guetta|Titanium|electro|house|4|2011|
Calvin Harris|Feel So Close|electro|house|4|2011|dj
Disclosure|Latch|electro|house|4|2012|d
Martin Solveig|Hello|electro|house|5|2010|dj
Bob Sinclar|Love Generation|electro|house|4|2005|dj
Fisher|Losing It|electro|house|5|2018|d
Kygo|Firestone|electro|house|3|2014|j
Paul Kalkbrenner|Sky and Sand|electro|techno|3|2009|
Paul Kalkbrenner|Aaron|electro|techno|3|2008|i
Stephan Bodzin|Powers of Ten|electro|techno|4|2015|i
Boris Brejcha|Purple Noise|electro|techno|4|2016|i
Laurent Garnier|The Man with the Red Face|electro|techno|4|2000|i
Moby|Go|electro|techno|5|1991|i
Underworld|Born Slippy .NUXX|electro|techno|5|1995|
The Chemical Brothers|Block Rockin' Beats|electro|techno|5|1997|d
The Prodigy|Firestarter|electro|techno|5|1996|
Carl Cox|I Want You (Forever)|electro|techno|5|1991|d
Jeff Mills|The Bells|electro|techno|5|1997|i
Kavinsky|Nightcall|electro|synthwave|3|2010|m
Kavinsky|Roadgame|electro|synthwave|4|2010|i
The Midnight|Sunset|electro|synthwave|3|2016|n
The Midnight|Los Angeles|electro|synthwave|3|2016|n
FM-84|Running in the Night|electro|synthwave|3|2016|n
Gunship|Fly for Your Life|electro|synthwave|4|2015|
College|A Real Hero|electro|synthwave|3|2011|n
Perturbator|Future Club|electro|synthwave|5|2014|i
Carpenter Brut|Turbo Killer|electro|synthwave|5|2016|i
M83|Midnight City|electro|synthwave|4|2011|n
Lazerhawk|Overdrive|electro|synthwave|4|2012|i
Haddaway|What Is Love|electro|dance|5|1993|dn
Corona|The Rhythm of the Night|electro|dance|5|1993|dj
Eiffel 65|Blue (Da Ba Dee)|electro|dance|5|1998|dj
Darude|Sandstorm|electro|trance|5|1999|di
Alice Deejay|Better Off Alone|electro|dance|5|1999|d
Snap!|Rhythm Is a Dancer|electro|dance|5|1992|d
2 Unlimited|No Limit|electro|dance|5|1993|d
La Bouche|Be My Lover|electro|dance|5|1995|d
Dr. Alban|It's My Life|electro|dance|5|1992|d
Gala|Freed from Desire|electro|dance|5|1996|dj
Modjo|Lady (Hear Me Tonight)|electro|dance|4|2000|dj
Cascada|Everytime We Touch|electro|dance|5|2005|d
ATB|9 PM (Till I Come)|electro|trance|5|1998|d
Robert Miles|Children|electro|trance|3|1995|in
Benny Benassi|Satisfaction|electro|dance|5|2002|d
IAM|Je danse le Mia|hiphop|fr|4|1993|djn
IAM|Petit frère|hiphop|fr|3|1997|m
MC Solaar|Bouge de là|hiphop|fr|4|1990|dj
MC Solaar|Caroline|hiphop|fr|3|1991|r
Suprême NTM|Ma Benz|hiphop|fr|4|1998|
Suprême NTM|Seine-Saint-Denis Style|hiphop|fr|4|1998|
Booba|DKR|rap|fr|3|2015|
PNL|Au DD|rap|fr|3|2019|m
Nekfeu|On verra|rap|fr|3|2015|m
Orelsan|Basique|rap|fr|4|2017|
Orelsan|La terre est ronde|rap|fr|3|2011|
Bigflo & Oli|Dommage|rap|fr|3|2017|m
Stromae|Alors on danse|rap|fr|4|2009|d
Stromae|Papaoutai|rap|fr|4|2013|dm
Jul|Tchikita|rap|fr|4|2016|dj
Ninho|Jefe|rap|fr|4|2021|
Damso|Macarena|rap|fr|3|2017|m
Diam's|La Boulette|rap|fr|4|2006|
Sniper|Gravé dans la roche|hiphop|fr|3|2003|
Lomepal|Trop beau|rap|fr|3|2018|r
Soprano|Cosmo|rap|fr|4|2014|j
Maître Gims|Sapés comme jamais|rap|fr|4|2015|dj
Eminem|Lose Yourself|rap|us|5|2002|
Eminem|Without Me|rap|us|5|2002|d
Dr. Dre|Still D.R.E.|hiphop|us|4|1999|
Dr. Dre|The Next Episode|hiphop|us|4|1999|d
Snoop Dogg|Drop It Like It's Hot|rap|us|3|2004|d
2Pac|California Love|hiphop|us|5|1995|d
2Pac|Changes|hiphop|us|3|1998|m
The Notorious B.I.G.|Juicy|hiphop|us|3|1994|n
Coolio|Gangsta's Paradise|hiphop|us|3|1995|m
OutKast|Hey Ya!|hiphop|us|5|2003|jd
OutKast|Ms. Jackson|hiphop|us|4|2000|
Kanye West|Stronger|rap|us|5|2007|d
Jay-Z|Empire State of Mind|rap|us|4|2009|
Kendrick Lamar|HUMBLE.|rap|us|4|2017|
Kendrick Lamar|Alright|rap|us|4|2015|
Drake|God's Plan|rap|us|3|2018|
Travis Scott|SICKO MODE|rap|us|4|2018|
Post Malone|Circles|rap|us|3|2019|m
Beastie Boys|Sabotage|hiphop|us|5|1994|
Run-DMC|It's Tricky|hiphop|us|5|1986|d
Wu-Tang Clan|C.R.E.A.M.|hiphop|us|3|1993|
Nas|N.Y. State of Mind|hiphop|us|3|1994|
House of Pain|Jump Around|hiphop|us|5|1992|dj
Iron Maiden|The Trooper|metal|heavy|5|1983|
Iron Maiden|Run to the Hills|metal|heavy|5|1982|
Iron Maiden|Fear of the Dark|metal|heavy|5|1992|
Judas Priest|Breaking the Law|metal|heavy|5|1980|
Judas Priest|Painkiller|metal|heavy|5|1990|
Metallica|Enter Sandman|metal|heavy|5|1991|
Metallica|Master of Puppets|metal|heavy|5|1986|
Metallica|Nothing Else Matters|metal|heavy|2|1991|rm
Metallica|The Unforgiven|metal|heavy|3|1991|m
Black Sabbath|Iron Man|metal|heavy|4|1970|
Ozzy Osbourne|Crazy Train|metal|heavy|5|1980|
Motörhead|Ace of Spades|metal|heavy|5|1980|
Dio|Holy Diver|metal|heavy|5|1983|
Megadeth|Symphony of Destruction|metal|heavy|5|1992|
Accept|Balls to the Wall|metal|heavy|4|1983|
System of a Down|Chop Suey!|metal|moderne|5|2001|
System of a Down|Toxicity|metal|moderne|5|2001|
Linkin Park|In the End|metal|moderne|4|2000|m
Linkin Park|Numb|metal|moderne|4|2003|m
Rammstein|Du hast|metal|moderne|5|1997|
Rammstein|Sonne|metal|moderne|5|2001|
Slipknot|Duality|metal|moderne|5|2004|
Slipknot|Psychosocial|metal|moderne|5|2008|
Gojira|Stranded|metal|moderne|5|2016|
Gojira|Amazonia|metal|moderne|5|2021|
Disturbed|The Sound of Silence|metal|moderne|2|2015|m
Avenged Sevenfold|Hail to the King|metal|moderne|5|2013|
Korn|Freak on a Leash|metal|moderne|5|1998|
Ghost|Square Hammer|metal|moderne|4|2016|
Rage Against the Machine|Killing in the Name|metal|moderne|5|1992|
Nightwish|Nemo|metal|symphonique|4|2004|m
Nightwish|Wish I Had an Angel|metal|symphonique|5|2004|
Within Temptation|Ice Queen|metal|symphonique|4|2001|
Within Temptation|Stand My Ground|metal|symphonique|4|2004|
Epica|Cry for the Moon|metal|symphonique|4|2003|
Evanescence|Bring Me to Life|metal|symphonique|4|2003|
Evanescence|My Immortal|metal|symphonique|2|2003|m
Therion|To Mega Therion|metal|symphonique|5|1996|
Rhapsody|Emerald Sword|metal|symphonique|5|1998|
Bryan Adams|Run to You|poprock|8090|4|1984|
Roxette|The Look|poprock|8090|4|1989|d
INXS|Need You Tonight|poprock|8090|4|1987|d
Tears for Fears|Shout|poprock|8090|4|1984|
The Cure|Friday I'm in Love|poprock|8090|4|1992|j
R.E.M.|Losing My Religion|poprock|8090|3|1991|m
Crowded House|Don't Dream It's Over|poprock|8090|2|1986|n
The Cranberries|Dreams|poprock|8090|4|1992|j
Alanis Morissette|Ironic|poprock|8090|3|1995|
Goo Goo Dolls|Iris|poprock|8090|3|1998|r
Third Eye Blind|Semi-Charmed Life|poprock|8090|4|1997|j
Sheryl Crow|All I Wanna Do|poprock|8090|3|1993|j
Hootie & the Blowfish|Hold My Hand|poprock|8090|3|1994|j
Train|Hey, Soul Sister|poprock|2000|4|2009|j
Maroon 5|This Love|poprock|2000|4|2002|
Coldplay|Clocks|poprock|2000|4|2002|
Snow Patrol|Chasing Cars|poprock|2000|2|2006|r
Keane|Somewhere Only We Know|poprock|2000|3|2004|n
The Fray|How to Save a Life|poprock|2000|3|2005|m
Kelly Clarkson|Since U Been Gone|poprock|2000|5|2004|
Avril Lavigne|Complicated|poprock|2000|3|2002|
Paramore|Misery Business|poprock|2000|5|2007|
OneRepublic|Apologize|poprock|2000|2|2007|m
The Script|Breakeven|poprock|2000|3|2008|m
Twenty One Pilots|Stressed Out|poprock|actuel|3|2015|n
Måneskin|Beggin'|poprock|actuel|5|2021|d
Måneskin|I Wanna Be Your Slave|poprock|actuel|5|2021|
Olivia Rodrigo|good 4 u|poprock|actuel|5|2021|
Fall Out Boy|Centuries|poprock|actuel|5|2014|
Panic! at the Disco|High Hopes|poprock|actuel|4|2018|j
Glass Animals|Heat Waves|poprock|actuel|3|2020|n
Benson Boone|Beautiful Things|poprock|actuel|3|2024|r
Noah Kahan|Stick Season|poprock|actuel|3|2022|n
Imagine Dragons|Thunder|poprock|actuel|4|2017|
BB Brunes|Dis-moi|poprock|fr|4|2007|
Superbus|Lola|poprock|fr|4|2006|j
Kyo|Le chemin|poprock|fr|3|2003|r
Luke|La sentinelle|poprock|fr|4|2004|
Mickey 3D|Respire|poprock|fr|3|2003|m
-M-|Machistador|poprock|fr|4|1999|
Les Innocents|L'autre Finistère|poprock|fr|3|1992|n
Raphaël|Caravane|poprock|fr|2|2005|m
Louise Attaque|Léa|poprock|fr|4|1997|
Shaka Ponk|My Name Is Stain|poprock|fr|5|2011|
B.B. King|The Thrill Is Gone|blues|blues|2|1969|m
John Lee Hooker|Boom Boom|blues|blues|4|1962|d
Muddy Waters|Mannish Boy|blues|blues|3|1955|
Muddy Waters|Hoochie Coochie Man|blues|blues|3|1954|
Stevie Ray Vaughan|Pride and Joy|blues|blues|4|1983|j
Stevie Ray Vaughan|Texas Flood|blues|blues|3|1983|m
Gary Moore|Still Got the Blues|blues|blues|2|1990|m
Eric Clapton|Tears in Heaven|blues|blues|1|1992|m
Derek and the Dominos|Layla|blues|blues|4|1970|
Joe Bonamassa|Sloe Gin|blues|blues|2|2007|m
Robert Johnson|Cross Road Blues|blues|blues|2|1936|
Etta James|I'd Rather Go Blind|blues|blues|1|1967|m
Gary Clark Jr.|Bright Lights|blues|blues|4|2011|
Bob Dylan|Like a Rolling Stone|blues|folk|3|1965|n
Bob Dylan|Knockin' on Heaven's Door|blues|folk|1|1973|m
Simon & Garfunkel|The Sound of Silence|blues|folk|1|1965|m
Simon & Garfunkel|Mrs. Robinson|blues|folk|3|1968|j
Tracy Chapman|Fast Car|blues|folk|2|1988|n
The Lumineers|Ho Hey|blues|folk|3|2012|j
Mumford & Sons|Little Lion Man|blues|folk|4|2009|
Mumford & Sons|I Will Wait|blues|folk|4|2012|
Bon Iver|Skinny Love|blues|folk|1|2007|m
Fleet Foxes|White Winter Hymnal|blues|folk|2|2008|
Of Monsters and Men|Little Talks|blues|folk|4|2011|j
Vance Joy|Riptide|blues|folk|3|2013|j
Cat Stevens|Father and Son|blues|folk|1|1970|m
Joni Mitchell|Big Yellow Taxi|blues|folk|3|1970|j
Ben Howard|Keep Your Head Up|blues|folk|3|2011|j
José González|Heartbeats|blues|folk|1|2003|m
Passenger|Let Her Go|blues|folk|2|2012|m
Marvin Gaye|What's Going On|soul|soul|2|1971|
Marvin Gaye|Let's Get It On|soul|soul|2|1973|r
Marvin Gaye|Ain't No Mountain High Enough|soul|soul|4|1967|j
Aretha Franklin|Respect|soul|soul|4|1967|j
Otis Redding|(Sittin' On) The Dock of the Bay|soul|soul|1|1968|m
Bill Withers|Ain't No Sunshine|soul|soul|1|1971|m
Bill Withers|Lovely Day|soul|soul|3|1977|j
Al Green|Let's Stay Together|soul|soul|2|1971|r
Sam Cooke|A Change Is Gonna Come|soul|soul|1|1964|m
Amy Winehouse|Back to Black|soul|soul|2|2006|m
Amy Winehouse|Rehab|soul|soul|4|2006|
Leon Bridges|River|soul|soul|1|2015|m
Ben E. King|Stand by Me|soul|soul|2|1961|r
Etta James|At Last|soul|soul|1|1960|r
Bee Gees|How Deep Is Your Love|soul|soul|2|1977|r
Stevie Wonder|Superstition|soul|funk|4|1972|d
Stevie Wonder|Sir Duke|soul|funk|4|1976|j
James Brown|I Got You (I Feel Good)|soul|funk|5|1965|dj
James Brown|Get Up (I Feel Like Being a) Sex Machine|soul|funk|5|1970|d
Jamiroquai|Virtual Insanity|soul|funk|4|1996|d
Jamiroquai|Cosmic Girl|soul|funk|5|1996|d
Earth, Wind & Fire|Let's Groove|soul|funk|5|1981|dj
Parliament|Give Up the Funk (Tear the Roof off the Sucker)|soul|funk|4|1975|d
Rick James|Super Freak|soul|funk|5|1981|d
Rufus|Ain't Nobody|soul|funk|4|1983|d
Earth, Wind & Fire|September|soul|disco|5|1978|dj
Kool & The Gang|Celebration|soul|disco|5|1980|dj
Chic|Le Freak|soul|disco|5|1978|d
Chic|Good Times|soul|disco|4|1979|d
Gloria Gaynor|I Will Survive|soul|disco|5|1978|dj
Donna Summer|Hot Stuff|soul|disco|5|1979|d
Donna Summer|I Feel Love|soul|disco|5|1977|d
Bee Gees|Stayin' Alive|soul|disco|5|1977|d
Village People|Y.M.C.A.|soul|disco|5|1978|dj
Boney M.|Rasputin|soul|disco|5|1978|d
Boney M.|Daddy Cool|soul|disco|5|1976|d
Sister Sledge|We Are Family|soul|disco|5|1979|dj
Bob Marley & The Wailers|Three Little Birds|reggae|roots|2|1977|j
Bob Marley & The Wailers|Is This Love|reggae|roots|3|1978|r
Bob Marley & The Wailers|Could You Be Loved|reggae|roots|4|1980|d
Bob Marley & The Wailers|No Woman, No Cry|reggae|roots|2|1974|m
Bob Marley & The Wailers|Buffalo Soldier|reggae|roots|3|1983|
Bob Marley & The Wailers|Jamming|reggae|roots|3|1977|d
Jimmy Cliff|The Harder They Come|reggae|roots|3|1972|
Jimmy Cliff|I Can See Clearly Now|reggae|roots|3|1993|j
UB40|Red Red Wine|reggae|roots|3|1983|r
UB40|Kingston Town|reggae|roots|2|1989|r
Toots & The Maytals|Pressure Drop|reggae|roots|3|1969|
Ziggy Marley|Tomorrow People|reggae|roots|3|1988|
Dennis Brown|Money in My Pocket|reggae|roots|3|1979|
Gregory Isaacs|Night Nurse|reggae|roots|2|1982|r
Inner Circle|Sweat (A La La La La Long)|reggae|dancehall|4|1992|dj
Shaggy|It Wasn't Me|reggae|dancehall|4|2000|dj
Shaggy|Boombastic|reggae|dancehall|4|1995|d
Sean Paul|Get Busy|reggae|dancehall|5|2003|d
Sean Paul|Temperature|reggae|dancehall|5|2005|d
Sean Paul|Like Glue|reggae|dancehall|5|2002|d
Damian Marley|Welcome to Jamrock|reggae|dancehall|4|2005|
Chaka Demus & Pliers|Tease Me|reggae|dancehall|4|1993|d
Beenie Man|Who Am I|reggae|dancehall|5|1997|d
Tryo|L'hymne de nos campagnes|reggae|fr|3|1998|j
Tryo|Serre-moi|reggae|fr|2|2004|r
Pierpoljak|Je sais pas jouer|reggae|fr|3|1998|j
Alpha Blondy|Jerusalem|reggae|fr|3|1986|
Alpha Blondy|Brigadier Sabari|reggae|fr|4|1982|
Sinsemilia|Tout le bonheur du monde|reggae|fr|3|2004|j
Raggasonic|Aiguisé comme une lame|reggae|fr|4|1995|
Tiken Jah Fakoly|Plus rien ne m'étonne|reggae|fr|3|2004|
Duke Ellington|Take the A Train|jazz|swing|3|1941|id
Duke Ellington|It Don't Mean a Thing (If It Ain't Got That Swing)|jazz|swing|4|1932|d
Benny Goodman|Sing, Sing, Sing|jazz|swing|5|1937|id
Glenn Miller|In the Mood|jazz|swing|4|1939|idj
Django Reinhardt|Minor Swing|jazz|manouche|4|1937|i
Django Reinhardt|Nuages|jazz|manouche|2|1940|in
Count Basie|One O'Clock Jump|jazz|swing|4|1937|id
Cab Calloway|Minnie the Moocher|jazz|swing|4|1931|j
Miles Davis|So What|jazz|cool|2|1959|i
Miles Davis|Blue in Green|jazz|cool|1|1959|im
Miles Davis|Freddie Freeloader|jazz|cool|2|1959|i
Dave Brubeck|Take Five|jazz|cool|3|1959|i
John Coltrane|My Favorite Things|jazz|cool|3|1961|i
Duke Ellington|In a Sentimental Mood|jazz|cool|1|1963|ir
Bill Evans|Waltz for Debby|jazz|cool|1|1961|i
Thelonious Monk|'Round Midnight|jazz|cool|1|1947|i
Louis Armstrong|What a Wonderful World|jazz|vocal|1|1967|rn
Ella Fitzgerald|Summertime|jazz|vocal|1|1957|m
Nina Simone|Feeling Good|jazz|vocal|3|1965|
Nina Simone|My Baby Just Cares for Me|jazz|vocal|3|1958|j
Chet Baker|My Funny Valentine|jazz|vocal|1|1954|r
Frank Sinatra|Fly Me to the Moon|jazz|vocal|3|1964|r
Frank Sinatra|My Way|jazz|vocal|2|1969|n
Billie Holiday|Strange Fruit|jazz|vocal|1|1939|m
Stan Getz|The Girl from Ipanema|jazz|vocal|2|1964|r
Norah Jones|Don't Know Why|jazz|vocal|1|2002|r
Diana Krall|The Look of Love|jazz|vocal|1|2001|r
Gregory Porter|Liquid Spirit|jazz|vocal|4|2013|j
Herbie Hancock|Cantaloupe Island|jazz|moderne|3|1964|i
Herbie Hancock|Chameleon|jazz|moderne|4|1973|id
Cannonball Adderley|Mercy, Mercy, Mercy|jazz|moderne|3|1966|i
Michel Petrucciani|Looking Up|jazz|moderne|3|1989|i
Weather Report|Birdland|jazz|moderne|4|1977|i
Pat Metheny Group|Last Train Home|jazz|moderne|3|1987|i
Snarky Puppy|Lingus|jazz|moderne|4|2014|i
GoGo Penguin|Hopopono|jazz|moderne|3|2014|i
Kamasi Washington|Truth|jazz|moderne|3|2017|i
Buena Vista Social Club|Chan Chan|latino|tropical|2|1997|n
Celia Cruz|La Vida Es Un Carnaval|latino|tropical|5|1998|dj
Celia Cruz|Quimbara|latino|tropical|5|1974|d
Marc Anthony|Vivir Mi Vida|latino|tropical|5|2013|dj
Kaoma|Lambada|latino|tropical|5|1989|dj
Los Del Rio|Macarena|latino|tropical|5|1993|dj
Santana|Oye Como Va|latino|tropical|3|1970|d
Héctor Lavoe|El Cantante|latino|tropical|4|1978|d
Luis Fonsi|Despacito|latino|reggaeton|4|2017|dr
Daddy Yankee|Gasolina|latino|reggaeton|5|2004|d
Daddy Yankee|Con Calma|latino|reggaeton|4|2019|d
J Balvin|Mi Gente|latino|reggaeton|4|2017|d
J Balvin|Ginza|latino|reggaeton|4|2015|d
Bad Bunny|Tití Me Preguntó|latino|reggaeton|4|2022|d
Bad Bunny|Dákiti|latino|reggaeton|3|2020|d
Karol G|Tusa|latino|reggaeton|4|2019|d
Shakira|Hips Don't Lie|latino|pop|5|2006|d
Shakira|Whenever, Wherever|latino|pop|4|2001|d
Ricky Martin|Livin' la Vida Loca|latino|pop|5|1999|dj
Enrique Iglesias|Bailando|latino|pop|4|2014|dj
Santana|Smooth|latino|pop|4|1999|d
Juanes|La Camisa Negra|latino|pop|4|2004|d
Carlos Vives|La Bicicleta|latino|pop|4|2016|dj
Camila Cabello|Havana|latino|pop|4|2017|d
Manu Chao|Me gustas tú|latino|pop|3|2001|j
Manu Chao|Clandestino|latino|pop|2|1998|m
Ritchie Valens|La Bamba|latino|pop|5|1958|dj
Gipsy Kings|Bamboléo|latino|flamenco|5|1987|dj
Gipsy Kings|Djobi Djoba|latino|flamenco|5|1987|dj
Gipsy Kings|Volare|latino|flamenco|4|1989|j
Gipsy Kings|Baila Me|latino|flamenco|5|1991|d
Rosalía|Malamente|latino|flamenco|4|2018|
Paco de Lucía|Entre dos aguas|latino|flamenco|3|1973|i
Camarón de la Isla|Como el agua|latino|flamenco|2|1981|m
Estopa|Como Camarón|latino|flamenco|4|1999|j
Johann Sebastian Bach|Air on the G String|classique|baroque|1|1730|i
Johann Sebastian Bach|Toccata and Fugue in D Minor|classique|baroque|4|1708|i
Johann Sebastian Bach|Cello Suite No. 1 Prelude|classique|baroque|2|1720|i
Antonio Vivaldi|The Four Seasons Spring|classique|baroque|4|1725|ij
Antonio Vivaldi|The Four Seasons Summer|classique|baroque|5|1725|i
Antonio Vivaldi|The Four Seasons Winter|classique|baroque|4|1725|i
Johann Pachelbel|Canon in D|classique|baroque|1|1680|ir
George Frideric Handel|Sarabande|classique|baroque|2|1733|im
Tomaso Albinoni|Adagio in G Minor|classique|baroque|1|1958|im
Ludwig van Beethoven|Symphony No. 5|classique|romantique|4|1808|i
Ludwig van Beethoven|Für Elise|classique|romantique|1|1810|i
Ludwig van Beethoven|Moonlight Sonata|classique|romantique|1|1801|im
Wolfgang Amadeus Mozart|Eine kleine Nachtmusik|classique|romantique|3|1787|ij
Wolfgang Amadeus Mozart|Rondo alla Turca|classique|romantique|4|1783|ij
Frédéric Chopin|Nocturne Op. 9 No. 2|classique|romantique|1|1832|ir
Pyotr Ilyich Tchaikovsky|Swan Lake|classique|romantique|3|1876|i
Pyotr Ilyich Tchaikovsky|Dance of the Sugar Plum Fairy|classique|romantique|2|1892|i
Edvard Grieg|In the Hall of the Mountain King|classique|romantique|4|1875|i
Antonín Dvořák|New World Symphony|classique|romantique|4|1893|i
Richard Wagner|Ride of the Valkyries|classique|romantique|5|1856|i
Johannes Brahms|Hungarian Dance No. 5|classique|romantique|4|1869|i
Erik Satie|Gymnopédie No. 1|classique|moderne|1|1888|im
Claude Debussy|Clair de lune|classique|moderne|1|1905|ir
Maurice Ravel|Boléro|classique|moderne|3|1928|i
Gustav Holst|Mars, the Bringer of War|classique|moderne|5|1916|i
Samuel Barber|Adagio for Strings|classique|moderne|1|1936|im
Ludovico Einaudi|Nuvole Bianche|classique|moderne|1|2004|im
Ludovico Einaudi|Experience|classique|moderne|2|2013|i
Max Richter|On the Nature of Daylight|classique|moderne|1|2004|im
Philip Glass|Metamorphosis One|classique|moderne|1|1988|i
Arvo Pärt|Spiegel im Spiegel|classique|moderne|1|1978|im
Yiruma|River Flows in You|classique|moderne|1|2001|ir
Carl Orff|O Fortuna|classique|lyrique|5|1937|
Giuseppe Verdi|La donna è mobile|classique|lyrique|4|1851|
Giuseppe Verdi|Libiamo ne' lieti calici|classique|lyrique|4|1853|j
Georges Bizet|Habanera|classique|lyrique|3|1875|
Wolfgang Amadeus Mozart|Lacrimosa|classique|lyrique|2|1791|m
Wolfgang Amadeus Mozart|Der Hölle Rache|classique|lyrique|4|1791|
George Frideric Handel|Hallelujah|classique|lyrique|4|1742|j
Giacomo Puccini|Nessun dorma|classique|lyrique|3|1926|
Léo Delibes|Flower Duet|classique|lyrique|1|1883|r
Hans Zimmer|Time|bo|films|3|2010|im
Hans Zimmer|Cornfield Chase|bo|films|2|2014|i
John Williams|Star Wars Main Title|bo|films|4|1977|i
John Williams|Jurassic Park Theme|bo|films|3|1993|i
John Williams|Hedwig's Theme|bo|films|3|2001|i
Howard Shore|Concerning Hobbits|bo|films|2|2001|in
Ennio Morricone|The Ecstasy of Gold|bo|films|4|1966|
Ennio Morricone|The Good, the Bad and the Ugly|bo|films|4|1966|i
Vangelis|Chariots of Fire|bo|films|3|1981|in
James Horner|For the Love of a Princess|bo|films|1|1995|ir
Yann Tiersen|Comptine d'un autre été, l'après-midi|bo|films|1|2001|im
Joe Hisaishi|One Summer's Day|bo|films|1|2001|in
Joe Hisaishi|Merry-Go-Round of Life|bo|films|2|2004|i
Ramin Djawadi|Game of Thrones Main Title|bo|series|4|2011|i
Ramin Djawadi|Light of the Seven|bo|series|2|2016|i
Ramin Djawadi|Westworld Main Title|bo|series|2|2016|i
Kyle Dixon & Michael Stein|Stranger Things|bo|series|3|2016|in
Nick Cave & The Bad Seeds|Red Right Hand|bo|series|3|1994|
Dave Porter|Breaking Bad Main Title Theme|bo|series|3|2008|i
Nicholas Britell|Succession (Main Title Theme)|bo|series|3|2018|i
Angelo Badalamenti|Twin Peaks Theme|bo|series|1|1990|im
Mark Snow|The X-Files|bo|series|2|1993|i
Jeremy Soule|Far Horizons|bo|jeux|1|2011|i
Jeremy Soule|Dragonborn|bo|jeux|5|2011|
Christopher Tin|Baba Yetu|bo|jeux|4|2005|
Nobuo Uematsu|One-Winged Angel|bo|jeux|5|1997|
Nobuo Uematsu|To Zanarkand|bo|jeux|1|2001|im
C418|Sweden|bo|jeux|1|2011|in
Gustavo Santaolalla|The Last of Us|bo|jeux|1|2013|im
Austin Wintory|Apotheosis|bo|jeux|3|2012|i
Mick Gordon|BFG Division|bo|jeux|5|2016|i
Marcin Przybyłowicz|Geralt of Rivia|bo|jeux|3|2015|i
Jesper Kyd|Ezio's Family|bo|jeux|2|2009|in
Darren Korb|Build That Wall|bo|jeux|2|2011|
Inon Zur|Fallout 4 Main Theme|bo|jeux|2|2015|i
Two Steps from Hell|Heart of Courage|bo|epique|5|2010|i
Two Steps from Hell|Victory|bo|epique|5|2015|i
Two Steps from Hell|Protectors of the Earth|bo|epique|5|2007|i
Hans Zimmer|Now We Are Free|bo|epique|3|2000|
Vangelis|Conquest of Paradise|bo|epique|3|1992|i
Klaus Badelt|He's a Pirate|bo|epique|5|2003|i
Steve Jablonsky|Arrival to Earth|bo|epique|4|2007|i
John Williams|Duel of the Fates|bo|epique|5|1999|
Nujabes|Aruarian Dance|lofi|lofi|2|2004|i
Nujabes|Feather|lofi|lofi|3|2005|
Nujabes|Luv(sic) Part 3|lofi|lofi|3|2008|r
Nujabes|Battlecry|lofi|lofi|3|2004|
Minmi|Shiki no Uta|lofi|lofi|2|2004|m
Tomppabeats|Monday Loop|lofi|lofi|2|2016|i
J Dilla|Time: The Donut of the Heart|lofi|lofi|2|2006|i
J Dilla|So Far to Go|lofi|lofi|2|2006|r
Massive Attack|Teardrop|lofi|downtempo|2|1998|m
Massive Attack|Unfinished Sympathy|lofi|downtempo|3|1991|
Portishead|Glory Box|lofi|downtempo|2|1994|m
Zero 7|In the Waiting Line|lofi|downtempo|2|2001|m
Thievery Corporation|Lebanese Blonde|lofi|downtempo|3|1996|
Air|La femme d'argent|lofi|downtempo|2|1998|i
Air|Sexy Boy|lofi|downtempo|3|1998|
Moby|Porcelain|lofi|downtempo|2|1999|m
St Germain|Rose Rouge|lofi|downtempo|3|2000|d
Morcheeba|The Sea|lofi|downtempo|2|1998|m
Hooverphonic|Mad About You|lofi|downtempo|2|2000|r
Mac DeMarco|Chamber of Reflection|lofi|downtempo|2|2014|m
Bonobo|Kerala|lofi|chillelectro|3|2016|i
Bonobo|Kiara|lofi|chillelectro|2|2010|i
Tycho|Awake|lofi|chillelectro|3|2014|i
Tycho|A Walk|lofi|chillelectro|2|2011|i
Khruangbin|Maria También|lofi|chillelectro|3|2018|i
Khruangbin|White Gloves|lofi|chillelectro|1|2015|
Emancipator|Soon It Will Be Cold Enough to Build Fires|lofi|chillelectro|2|2006|i
FKJ|Ylang Ylang|lofi|chillelectro|2|2017|i
Bon Entendeur|Le temps est bon|lofi|chillelectro|3|2018|j
Polo & Pan|Canopée|lofi|chillelectro|3|2016|j
Petit Biscuit|Sunset Lover|lofi|chillelectro|3|2015|i
ODESZA|Say My Name|lofi|chillelectro|4|2014|
Rhye|Open|lofi|chillelectro|1|2013|r
BTS|Dynamite|asie|kpop|4|2020|dj
BTS|Butter|asie|kpop|4|2021|dj
BLACKPINK|DDU-DU DDU-DU|asie|kpop|5|2018|d
BLACKPINK|How You Like That|asie|kpop|5|2020|d
PSY|Gangnam Style|asie|kpop|5|2012|dj
NewJeans|Super Shy|asie|kpop|4|2023|dj
NewJeans|Hype Boy|asie|kpop|4|2022|d
Stray Kids|S-Class|asie|kpop|5|2023|
TWICE|Fancy|asie|kpop|4|2019|d
IVE|Love Dive|asie|kpop|4|2022|d
aespa|Supernova|asie|kpop|5|2024|d
BIGBANG|Fantastic Baby|asie|kpop|5|2012|d
ROSÉ|APT.|asie|kpop|5|2024|dj
YOASOBI|Yoru ni Kakeru|asie|jpop|4|2019|m
Official HIGE DANdism|Pretender|asie|jpop|3|2019|m
Official HIGE DANdism|Subtitle|asie|jpop|2|2022|m
Kenshi Yonezu|Lemon|asie|jpop|2|2018|m
Fujii Kaze|Shinunoga E-Wa|asie|jpop|3|2020|r
Creepy Nuts|Bling-Bang-Bang-Born|asie|jpop|5|2024|d
Ado|Usseewa|asie|jpop|5|2020|
King Gnu|Hakujitsu|asie|jpop|3|2019|m
Utada Hikaru|First Love|asie|jpop|1|1999|r
YOASOBI|Idol|asie|anime|5|2023|d
Kenshi Yonezu|KICK BACK|asie|anime|5|2022|
LiSA|Gurenge|asie|anime|5|2019|
Linked Horizon|Guren no Yumiya|asie|anime|5|2013|
Eve|Kaikai Kitan|asie|anime|5|2020|
Yoko Takahashi|A Cruel Angel's Thesis|asie|anime|4|1995|n
Hiroshi Kitadani|We Are!|asie|anime|4|1999|jn
FLOW|GO!!!|asie|anime|5|2004|n
Ikimonogakari|Blue Bird|asie|anime|4|2008|n
Aimer|Zankyosanka|asie|anime|5|2022|
Mariya Takeuchi|Plastic Love|asie|citypop|3|1984|n
Mariya Takeuchi|September|asie|citypop|3|1979|n
Miki Matsubara|Mayonaka no Door (Stay with Me)|asie|citypop|3|1979|nm
Tatsuro Yamashita|Ride on Time|asie|citypop|4|1980|j
Anri|Last Summer Whisper|asie|citypop|2|1982|n
Tomoko Aran|Midnight Pretenders|asie|citypop|2|1983|n
Taeko Ohnuki|4:00 A.M.|asie|citypop|2|1978|n
Meiko Nakahara|Fantasy|asie|citypop|4|1982|d
Burna Boy|Last Last|monde|afro|3|2022|m
Wizkid|Essence|monde|afro|3|2020|r
Rema|Calm Down|monde|afro|3|2022|d
Davido|Fall|monde|afro|3|2017|d
Tems|Free Mind|monde|afro|2|2020|
Tyla|Water|monde|afro|3|2023|d
Fela Kuti|Water No Get Enemy|monde|afro|4|1975|d
Angélique Kidjo|Agolo|monde|afro|4|1994|d
Mory Kanté|Yé ké yé ké|monde|afro|5|1987|dj
Magic System|Premier Gaou|monde|afro|5|2002|dj
Amadou & Mariam|Dimanche à Bamako|monde|afro|4|2004|j
Aya Nakamura|Djadja|monde|afro|4|2018|d
Khaled|Aïcha|monde|orient|3|1996|r
Khaled|Didi|monde|orient|5|1992|dj
Khaled|C'est la vie|monde|orient|5|2012|dj
Rachid Taha|Ya Rayah|monde|orient|4|1997|n
Rachid Taha|Barra Barra|monde|orient|5|2000|
Faudel|Tellement je t'aime|monde|orient|3|1997|r
Amr Diab|Tamally Maak|monde|orient|3|2000|r
Nancy Ajram|Ah W Noss|monde|orient|4|2004|d
Souad Massi|Raoui|monde|orient|2|2001|m
Sérgio Mendes|Mas que Nada|monde|bresil|4|1966|dj
Jorge Ben Jor|Taj Mahal|monde|bresil|5|1972|dj
Gilberto Gil|Aquele Abraço|monde|bresil|4|1969|j
João Gilberto|Chega de Saudade|monde|bresil|2|1959|n
Elis Regina|Águas de Março|monde|bresil|3|1974|j
Os Mutantes|A Minha Menina|monde|bresil|4|1968|j
Bebel Gilberto|Samba da Bênção|monde|bresil|2|2000|r
Anitta|Envolver|monde|bresil|4|2021|d
Michel Teló|Ai Se Eu Te Pego|monde|bresil|5|2011|dj
A. R. Rahman|Jai Ho|monde|inde|5|2008|dj
A. R. Rahman|Chaiyya Chaiyya|monde|inde|4|1998|d
Panjabi MC|Mundian To Bach Ke|monde|inde|5|1998|d
Daler Mehndi|Tunak Tunak Tun|monde|inde|5|1998|dj
Arijit Singh|Tum Hi Ho|monde|inde|1|2013|rm
Arijit Singh|Kesariya|monde|inde|2|2022|r
Nusrat Fateh Ali Khan|Mustt Mustt|monde|inde|4|1990|
Asha Bhosle|Dum Maro Dum|monde|inde|4|1971|n
# --- Ajouts de la version 2.0 ---
Morgan Wallen|Chasin' You|country|moderne|3|2019|r
Morgan Wallen|7 Summers|country|moderne|2|2020|n
Morgan Wallen|Sand in My Boots|country|moderne|2|2021|m
Morgan Wallen|You Proof|country|moderne|3|2022|
Morgan Wallen|Thinkin' Bout Me|country|moderne|3|2023|
Morgan Wallen|Lies Lies Lies|country|moderne|2|2024|m
Morgan Wallen|Love Somebody|country|moderne|3|2024|r
Luke Combs|Hurricane|country|moderne|3|2016|r
Luke Combs|She Got the Best of Me|country|moderne|3|2018|m
Luke Combs|Even Though I'm Leaving|country|moderne|2|2019|m
Luke Combs|Forever After All|country|moderne|2|2020|r
Luke Combs|The Kind of Love We Make|country|moderne|3|2022|r
Luke Combs|Where the Wild Things Are|country|moderne|3|2023|
Luke Combs|Ain't No Love in Oklahoma|country|moderne|4|2024|
Thomas Rhett|Crash and Burn|country|moderne|4|2015|d
Thomas Rhett|Marry Me|country|moderne|2|2017|r
Thomas Rhett|Look What God Gave Her|country|moderne|3|2019|r
Thomas Rhett|Craving You|country|moderne|3|2017|r
Thomas Rhett|Beer Can't Fix|country|moderne|3|2020|j
Chris Stapleton|Broken Halos|country|moderne|2|2017|
Chris Stapleton|You Should Probably Leave|country|moderne|2|2020|
Chris Stapleton|White Horse|country|moderne|4|2023|
Kane Brown|What Ifs|country|moderne|3|2017|r
Kane Brown|Thank God|country|moderne|2|2023|r
Kane Brown|Like I Love Country Music|country|moderne|4|2022|j
Jason Aldean|Tattoos on This Town|country|moderne|3|2011|n
Jason Aldean|Night Train|country|moderne|3|2012|
Jason Aldean|Burnin' It Down|country|moderne|2|2014|r
Jason Aldean|Try That in a Small Town|country|moderne|4|2023|
Carrie Underwood|Blown Away|country|moderne|4|2012|
Carrie Underwood|Something in the Water|country|moderne|3|2014|
Carrie Underwood|Cowboy Casanova|country|moderne|4|2009|
Miranda Lambert|Gunpowder & Lead|country|moderne|4|2008|
Miranda Lambert|Mama's Broken Heart|country|moderne|4|2013|
Miranda Lambert|Bluebird|country|moderne|2|2019|
Kelsea Ballerini|Peter Pan|country|moderne|3|2016|m
Kelsea Ballerini|Miss Me More|country|moderne|3|2019|
Maren Morris|My Church|country|moderne|3|2016|j
Maren Morris|The Bones|country|moderne|3|2019|r
Gabby Barrett|I Hope|country|moderne|3|2019|
Old Dominion|Break Up with Him|country|moderne|3|2015|
Old Dominion|One Man Band|country|moderne|2|2019|r
Old Dominion|No Such Thing as a Broken Heart|country|moderne|3|2020|
Jordan Davis|Buy Dirt|country|moderne|2|2021|n
Jordan Davis|Singles You Up|country|moderne|3|2017|
Jordan Davis|Next Thing You Know|country|moderne|2|2023|n
Cole Swindell|She Had Me at Heads Carolina|country|moderne|4|2022|j
Cole Swindell|Break Up in the End|country|moderne|2|2018|m
Dylan Scott|My Girl|country|moderne|3|2016|r
Dustin Lynch|Small Town Boy|country|moderne|3|2017|
Lee Brice|I Drive Your Truck|country|moderne|2|2012|m
Lee Brice|One of Them Girls|country|moderne|3|2019|
Brett Young|In Case You Didn't Know|country|moderne|2|2016|r
Brett Young|Mercy|country|moderne|2|2017|m
Dierks Bentley|Drunk on a Plane|country|moderne|4|2014|j
Dierks Bentley|What Was I Thinkin'|country|moderne|4|2003|
Dierks Bentley|Gone|country|moderne|3|2021|
Luke Bryan|Crash My Party|country|moderne|3|2013|
Luke Bryan|Drink a Beer|country|moderne|2|2013|m
Luke Bryan|Most People Are Good|country|moderne|2|2017|
Eric Church|Drink in My Hand|country|moderne|4|2011|j
Eric Church|Record Year|country|moderne|3|2016|m
Eric Church|Talladega|country|moderne|3|2014|n
HARDY|Wait in the Truck|country|moderne|3|2022|
HARDY|One Beer|country|moderne|3|2020|
Lainey Wilson|Things a Man Oughta Know|country|moderne|2|2021|
Jelly Roll|Son of a Sinner|country|moderne|3|2022|m
Zach Bryan|I Remember Everything|country|moderne|2|2023|m
Zach Bryan|Burn, Burn, Burn|country|moderne|3|2022|
Zach Bryan|Pink Skies|country|moderne|2|2024|n
Megan Moroney|Tennessee Orange|country|moderne|2|2022|r
Bailey Zimmerman|Religiously|country|moderne|3|2022|m
Bailey Zimmerman|Fall in Love|country|moderne|3|2022|r
Riley Green|I Wish Grandpas Never Died|country|moderne|2|2019|n
Parker McCollum|Pretty Heart|country|moderne|3|2020|m
Jon Pardi|Dirt on My Boots|country|moderne|4|2016|d
Jon Pardi|Heartache Medication|country|moderne|3|2019|
Sam Hunt|Take Your Time|country|moderne|2|2014|r
Sam Hunt|Body Like a Back Road|country|moderne|3|2017|r
Florida Georgia Line|H.O.L.Y.|country|moderne|2|2016|r
Bebe Rexha|Meant to Be|country|moderne|3|2017|j
Blake Shelton|God's Country|country|moderne|3|2019|
Blake Shelton|Honey Bee|country|moderne|3|2011|r
Keith Urban|Blue Ain't Your Color|country|moderne|2|2016|m
Keith Urban|Wasted Time|country|moderne|4|2016|n
Little Big Town|Girl Crush|country|moderne|2|2014|m
Little Big Town|Pontoon|country|moderne|3|2012|j
Kenny Chesney|American Kids|country|moderne|4|2014|j
Brothers Osborne|Stay a Little Longer|country|moderne|3|2015|
Brothers Osborne|It Ain't My Fault|country|moderne|4|2017|
Kacey Musgraves|Rainbow|country|moderne|1|2018|
Ashley McBryde|Girl Goin' Nowhere|country|moderne|2|2018|
Chris Young|Famous Friends|country|moderne|4|2021|j
Walker Hayes|Fancy Like|country|moderne|4|2021|d
Russell Dickerson|Yours|country|moderne|2|2016|r
Shaboozey|A Bar Song (Tipsy)|country|moderne|4|2024|d
Post Malone|I Had Some Help|country|moderne|4|2024|
Tucker Wetmore|Wind Up Missin' You|country|moderne|3|2024|
Ella Langley|You Look Like You Love Me|country|moderne|4|2024|
George Strait|You Look So Good in Love|country|balade|2|1983|r
George Strait|I Cross My Heart|country|balade|2|1992|r
George Strait|Check Yes or No|country|balade|3|1995|n
George Strait|Troubadour|country|balade|2|2008|n
Alan Jackson|Livin' on Love|country|balade|2|1994|r
Alan Jackson|Where Were You (When the World Stopped Turning)|country|balade|1|2001|m
Alan Jackson|Drive (For Daddy Gene)|country|balade|2|2002|n
Randy Travis|Three Wooden Crosses|country|balade|2|2002|m
Randy Travis|Diggin' Up Bones|country|balade|2|1986|
Garth Brooks|If Tomorrow Never Comes|country|balade|2|1989|r
Garth Brooks|Unanswered Prayers|country|balade|2|1990|n
Garth Brooks|To Make You Feel My Love|country|balade|1|1998|r
Vince Gill|Go Rest High on That Mountain|country|balade|1|1995|m
Vince Gill|Look at Us|country|balade|2|1991|r
Reba McEntire|Fancy|country|balade|3|1990|
Reba McEntire|Does He Love You|country|balade|2|1993|m
Trisha Yearwood|She's in Love with the Boy|country|balade|3|1991|r
Faith Hill|Breathe|country|balade|2|1999|r
Faith Hill|There You'll Be|country|balade|2|2001|m
Tim McGraw|Live Like You Were Dying|country|balade|2|2004|
Tim McGraw|Humble and Kind|country|balade|1|2015|
Tim McGraw|Don't Take the Girl|country|balade|2|1994|m
Martina McBride|Independence Day|country|balade|3|1994|
LeAnn Rimes|How Do I Live|country|balade|2|1997|r
LeAnn Rimes|Blue|country|balade|2|1996|m
Rascal Flatts|Bless the Broken Road|country|balade|2|2004|r
Rascal Flatts|What Hurts the Most|country|balade|2|2006|m
Lonestar|Amazed|country|balade|2|1999|r
Josh Turner|Your Man|country|balade|2|2005|r
Lady A|Just a Kiss|country|balade|2|2011|r
Lady A|I Run to You|country|balade|3|2009|r
Carrie Underwood|Jesus, Take the Wheel|country|balade|2|2005|
Keith Whitley|When You Say Nothing at All|country|balade|2|1988|r
Don Williams|I Believe in You|country|balade|1|1980|
Don Williams|Tulsa Time|country|balade|3|1978|
Conway Twitty|Hello Darlin'|country|balade|1|1970|m
George Jones|He Stopped Loving Her Today|country|balade|1|1980|m
Tammy Wynette|Stand by Your Man|country|balade|2|1968|r
Loretta Lynn|Coal Miner's Daughter|country|balade|2|1970|n
Patsy Cline|Walkin' After Midnight|country|balade|2|1957|m
Patsy Cline|I Fall to Pieces|country|balade|1|1961|m
Hank Williams|Your Cheatin' Heart|country|balade|2|1953|m
Hank Williams|I'm So Lonesome I Could Cry|country|balade|1|1949|m
Emmylou Harris|Boulder to Birmingham|country|balade|1|1975|m
Glen Campbell|Rhinestone Cowboy|country|balade|3|1975|n
Glen Campbell|Gentle on My Mind|country|balade|2|1967|n
John Denver|Annie's Song|country|balade|1|1974|r
Kenny Rogers|Lucille|country|balade|2|1977|m
Kenny Rogers|Coward of the County|country|balade|2|1979|
Dolly Parton|Coat of Many Colors|country|balade|1|1971|n
Willie Nelson|Georgia on My Mind|country|balade|1|1978|n
Alison Krauss|When You Say Nothing at All|country|balade|1|1995|r
Brad Paisley|Then|country|balade|2|2009|r
Brad Paisley|She's Everything|country|balade|2|2006|r
Kenny Chesney|There Goes My Life|country|balade|2|2003|
Craig Morgan|That's What I Love About Sunday|country|balade|2|2005|j
Sugarland|Stay|country|balade|1|2007|m
Chris Young|Tomorrow|country|balade|2|2011|m
Kip Moore|Somethin' 'Bout a Truck|country|balade|3|2011|
Brooks & Dunn|My Maria|country|dance|4|1996|
Brooks & Dunn|Hillbilly Deluxe|country|dance|4|2005|
Brooks & Dunn|Brand New Man|country|dance|4|1991|
Garth Brooks|Callin' Baton Rouge|country|dance|5|1994|j
Garth Brooks|Ain't Goin' Down ('Til the Sun Comes Up)|country|dance|5|1993|j
Alan Jackson|It's Five O'Clock Somewhere|country|dance|3|2003|j
Alan Jackson|Good Time|country|dance|4|2008|d
Shania Twain|Any Man of Mine|country|dance|4|1995|d
Shania Twain|Honey, I'm Home|country|dance|4|1998|d
Shania Twain|Up!|country|dance|4|2002|j
Montgomery Gentry|Hell Yeah|country|dance|4|2003|
Montgomery Gentry|Something to Be Proud Of|country|dance|3|2005|
Toby Keith|I Love This Bar|country|dance|3|2003|j
Toby Keith|Red Solo Cup|country|dance|4|2011|j
Toby Keith|How Do You Like Me Now?!|country|dance|4|1999|
Joe Diffie|Pickup Man|country|dance|4|1994|j
Mark Chesnutt|Bubba Shot the Jukebox|country|dance|4|1992|j
Tracy Byrd|Watermelon Crawl|country|dance|4|1994|d
Travis Tritt|T-R-O-U-B-L-E|country|dance|5|1992|d
Travis Tritt|Here's a Quarter (Call Someone Who Cares)|country|dance|3|1991|
Alabama|Dixieland Delight|country|dance|4|1983|j
Alabama|Mountain Music|country|dance|4|1982|j
Kenny Chesney|She Thinks My Tractor's Sexy|country|dance|4|1999|j
Kenny Chesney|Summertime|country|dance|4|2006|j
Big & Rich|Comin' to Your City|country|dance|5|2005|
Jason Aldean|She's Country|country|dance|5|2009|
Jason Aldean|Big Green Tractor|country|dance|3|2009|r
Luke Bryan|That's My Kind of Night|country|dance|4|2013|d
Luke Bryan|Rain Is a Good Thing|country|dance|4|2010|j
Florida Georgia Line|This Is How We Roll|country|dance|4|2014|d
Blake Shelton|Some Beach|country|dance|3|2004|j
Blake Shelton|Footloose|country|dance|5|2011|d
Billy Currington|People Are Crazy|country|dance|3|2009|
Billy Currington|Pretty Good at Drinkin' Beer|country|dance|4|2010|j
Dierks Bentley|Free and Easy (Down the Road I Go)|country|dance|4|2007|j
Sam Hunt|House Party|country|dance|4|2015|d
Gretchen Wilson|Here for the Party|country|dance|5|2004|d
Sara Evans|Suds in the Bucket|country|dance|4|2004|j
Miranda Lambert|Kerosene|country|dance|4|2005|
Trace Adkins|Honky Tonk Badonkadonk|country|dance|4|2005|d
Lee Brice|Parking Lot Party|country|dance|4|2013|d
Morgan Wallen|Up Down|country|dance|4|2017|d
Luke Combs|Beer Never Broke My Heart|country|dance|4|2019|j
Luke Combs|1, 2 Many|country|dance|5|2019|d
Jon Pardi|Head Over Boots|country|dance|3|2016|r
Mary Chapin Carpenter|Down at the Twist and Shout|country|dance|4|1991|d
Diamond Rio|Meet in the Middle|country|dance|3|1991|j
Vince Gill|One More Last Chance|country|dance|4|1993|
George Strait|All My Ex's Live in Texas|country|dance|4|1987|j
George Strait|Write This Down|country|dance|4|1999|
Brad Paisley|Water|country|dance|4|2009|j
Brad Paisley|Ticks|country|dance|3|2007|j
Waylon Jennings|Good Hearted Woman|country|outlaw|3|1972|
Waylon Jennings|Are You Sure Hank Done It This Way|country|outlaw|3|1975|
Waylon Jennings|I've Always Been Crazy|country|outlaw|3|1978|
Willie Nelson|Whiskey River|country|outlaw|3|1973|
Merle Haggard|Okie from Muskogee|country|outlaw|3|1969|
Merle Haggard|Silver Wings|country|outlaw|1|1969|m
Merle Haggard|Workin' Man Blues|country|outlaw|4|1969|
Johnny Cash|A Boy Named Sue|country|outlaw|3|1969|
Johnny Cash|Man in Black|country|outlaw|2|1971|
Johnny Cash|God's Gonna Cut You Down|country|outlaw|3|2006|
Kris Kristofferson|Sunday Mornin' Comin' Down|country|outlaw|2|1970|m
Kris Kristofferson|Help Me Make It Through the Night|country|outlaw|1|1970|m
Hank Williams Jr.|A Country Boy Can Survive|country|outlaw|3|1982|
Hank Williams Jr.|All My Rowdy Friends Are Coming Over Tonight|country|outlaw|4|1984|j
David Allan Coe|Longhaired Redneck|country|outlaw|3|1976|
Jerry Jeff Walker|Mr. Bojangles|country|outlaw|1|1968|m
Guy Clark|Desperados Waiting for a Train|country|outlaw|2|1975|n
Townes Van Zandt|To Live Is to Fly|country|outlaw|1|1972|m
Steve Earle|Galway Girl|country|outlaw|4|2000|j
Steve Earle|Guitar Town|country|outlaw|4|1986|
Dwight Yoakam|A Thousand Miles from Nowhere|country|outlaw|2|1993|m
Dwight Yoakam|Streets of Bakersfield|country|outlaw|4|1988|
Lucinda Williams|Car Wheels on a Gravel Road|country|outlaw|3|1998|
Gillian Welch|Look at Miss Ohio|country|outlaw|2|2003|m
Ryan Adams|Come Pick Me Up|country|outlaw|2|2000|m
Old Crow Medicine Show|Wagon Wheel|country|outlaw|4|2004|j
Darius Rucker|Wagon Wheel|country|outlaw|4|2013|j
Jamey Johnson|In Color|country|outlaw|2|2008|n
Chris Stapleton|Fire Away|country|outlaw|2|2015|m
Chris Stapleton|Nobody to Blame|country|outlaw|3|2015|
Sturgill Simpson|You Can Have the Crown|country|outlaw|3|2014|
Tyler Childers|Whitehouse Road|country|outlaw|4|2017|
Tyler Childers|In Your Love|country|outlaw|2|2023|r
Jason Isbell|If We Were Vampires|country|outlaw|1|2017|r
Colter Wall|Sleeping on the Blacktop|country|outlaw|3|2017|
Colter Wall|The Devil Wears a Suit and Tie|country|outlaw|3|2015|
Cody Jinks|Loud and Heavy|country|outlaw|2|2016|m
Whiskey Myers|Ballad of a Southern Man|country|outlaw|3|2011|
Turnpike Troubadours|Diamonds & Gasoline|country|outlaw|3|2010|
Zach Bryan|Oklahoma Smokeshow|country|outlaw|3|2021|r
Zach Bryan|Sun to Me|country|outlaw|2|2022|r
Orville Peck|Dead of Night|country|outlaw|2|2019|m
Margo Price|Hurtin' (On the Bottle)|country|outlaw|3|2016|
Billy Joe Shaver|Georgia on a Fast Train|country|outlaw|4|1973|
Johnny Paycheck|Take This Job and Shove It|country|outlaw|4|1977|
The Highwaymen|Desperados Waiting for a Train|country|outlaw|2|1985|n
Fleetwood Mac|Everywhere|rock|soft|3|1987|r
Fleetwood Mac|Rhiannon|rock|soft|3|1975|
Eagles|Desperado|rock|soft|1|1973|m
Eagles|Lyin' Eyes|rock|soft|2|1975|
Eagles|Life in the Fast Lane|rock|classic|4|1976|
Eagles|Take It to the Limit|rock|soft|2|1975|m
America|Sister Golden Hair|rock|soft|3|1975|
Cat Stevens|Peace Train|rock|soft|3|1971|j
James Taylor|Fire and Rain|rock|soft|1|1970|m
James Taylor|Carolina in My Mind|rock|soft|2|1968|n
Carole King|It's Too Late|rock|soft|2|1971|m
Carole King|I Feel the Earth Move|rock|soft|3|1971|j
Simon & Garfunkel|Bridge over Troubled Water|rock|soft|1|1970|
Simon & Garfunkel|The Boxer|rock|soft|2|1969|m
Simon & Garfunkel|Cecilia|rock|soft|4|1970|j
Crosby, Stills, Nash & Young|Teach Your Children|rock|soft|2|1970|
Neil Young|Harvest Moon|rock|soft|1|1992|r
Neil Young|Old Man|rock|soft|2|1972|m
Elton John|Rocket Man|rock|soft|2|1972|m
Elton John|Goodbye Yellow Brick Road|rock|soft|2|1973|n
Elton John|Saturday Night's Alright for Fighting|rock|classic|5|1973|
Billy Joel|Just the Way You Are|rock|soft|2|1977|r
Billy Joel|Uptown Girl|rock|classic|4|1983|j
Billy Joel|We Didn't Start the Fire|rock|classic|4|1989|
Chris Rea|The Road to Hell|rock|soft|3|1989|
Chris Rea|Josephine|rock|soft|2|1985|r
Dire Straits|Money for Nothing|rock|classic|4|1985|
Dire Straits|Brothers in Arms|rock|soft|1|1985|m
Dire Straits|Private Investigations|rock|soft|1|1982|m
Mark Knopfler|What It Is|rock|soft|3|2000|
Bruce Springsteen|Streets of Philadelphia|rock|soft|1|1993|m
Bruce Springsteen|Born in the U.S.A.|rock|classic|5|1984|
Bruce Springsteen|The River|rock|soft|2|1980|m
Bruce Springsteen|Thunder Road|rock|classic|4|1975|
Bruce Springsteen|Hungry Heart|rock|classic|4|1980|j
Tom Petty|Learning to Fly|rock|soft|3|1991|
Tom Petty and the Heartbreakers|Mary Jane's Last Dance|rock|classic|3|1993|
Bryan Adams|(Everything I Do) I Do It for You|rock|soft|2|1991|r
Foreigner|Cold as Ice|rock|classic|4|1977|
Foreigner|Juke Box Hero|rock|classic|4|1981|
Journey|Faithfully|rock|soft|2|1983|r
Journey|Open Arms|rock|soft|1|1982|r
Journey|Separate Ways (Worlds Apart)|rock|classic|4|1983|
Toto|Rosanna|rock|classic|4|1982|
Toto|Hold the Line|rock|classic|4|1978|
Boston|Peace of Mind|rock|classic|4|1976|
Kansas|Dust in the Wind|rock|soft|1|1977|m
Kansas|Carry On Wayward Son|rock|classic|4|1976|
Styx|Come Sail Away|rock|classic|3|1977|
Supertramp|Give a Little Bit|rock|soft|3|1977|j
Supertramp|It's Raining Again|rock|classic|3|1982|
The Police|Roxanne|rock|classic|4|1978|
The Police|Message in a Bottle|rock|classic|4|1979|
Sting|Fields of Gold|rock|soft|1|1993|r
Sting|Englishman in New York|rock|soft|2|1987|
Sting|Shape of My Heart|rock|soft|1|1993|m
The Beatles|Let It Be|rock|soft|2|1970|
The Beatles|Hey Jude|rock|soft|2|1968|
The Beatles|Yesterday|rock|soft|1|1965|m
The Beatles|Twist and Shout|rock|classic|5|1963|d
The Beatles|Something|rock|soft|2|1969|r
The Beatles|In My Life|rock|soft|1|1965|n
John Lennon|Imagine|rock|soft|1|1971|
George Harrison|My Sweet Lord|rock|soft|2|1970|
Paul McCartney & Wings|Live and Let Die|rock|classic|4|1973|
The Rolling Stones|Angie|rock|soft|1|1973|m
The Rolling Stones|Start Me Up|rock|classic|4|1981|
The Rolling Stones|Wild Horses|rock|soft|1|1971|m
The Rolling Stones|Jumpin' Jack Flash|rock|classic|4|1968|
The Who|My Generation|rock|classic|4|1965|
The Who|Pinball Wizard|rock|classic|4|1969|
The Kinks|Waterloo Sunset|rock|soft|2|1967|n
The Doors|Light My Fire|rock|prog|3|1967|
The Doors|People Are Strange|rock|classic|3|1967|
The Animals|The House of the Rising Sun|rock|classic|3|1964|m
Creedence Clearwater Revival|Bad Moon Rising|rock|classic|4|1969|
Creedence Clearwater Revival|Proud Mary|rock|classic|4|1969|
Creedence Clearwater Revival|Down on the Corner|rock|classic|4|1969|j
The Eagles|Hotel California|rock|classic|3|1976|
Pink Floyd|Another Brick in the Wall, Pt. 2|rock|classic|4|1979|
Pink Floyd|Money|rock|prog|3|1973|
Pink Floyd|Time|rock|classic|3|1973|
Led Zeppelin|Kashmir|rock|hard|4|1975|
Led Zeppelin|Black Dog|rock|hard|5|1971|
Led Zeppelin|Rock and Roll|rock|hard|5|1971|
Led Zeppelin|Since I've Been Loving You|rock|hard|2|1970|m
Deep Purple|Child in Time|rock|hard|3|1970|
Deep Purple|Burn|rock|hard|5|1974|
Black Sabbath|War Pigs|rock|hard|4|1970|
AC/DC|You Shook Me All Night Long|rock|hard|5|1980|d
AC/DC|It's a Long Way to the Top (If You Wanna Rock 'n' Roll)|rock|hard|4|1975|
AC/DC|Shoot to Thrill|rock|hard|5|1980|
Aerosmith|Sweet Emotion|rock|hard|4|1975|
Aerosmith|I Don't Want to Miss a Thing|rock|soft|2|1998|r
Aerosmith|Crazy|rock|soft|3|1994|
Guns N' Roses|Patience|rock|soft|2|1988|r
Guns N' Roses|Knockin' on Heaven's Door|rock|hard|3|1991|
Bon Jovi|It's My Life|rock|hard|5|2000|
Bon Jovi|Bed of Roses|rock|soft|2|1993|r
Bon Jovi|Always|rock|soft|2|1994|r
Def Leppard|Photograph|rock|hard|4|1983|
Van Halen|Ain't Talkin' 'bout Love|rock|hard|4|1978|
Scorpions|Wind of Change|rock|soft|2|1990|n
Europe|The Final Countdown|rock|hard|5|1986|
Europe|Carrie|rock|soft|2|1987|r
Whitesnake|Is This Love|rock|soft|2|1987|r
Kiss|I Was Made for Lovin' You|rock|hard|4|1979|d
Queen|We Will Rock You|rock|classic|4|1977|
Queen|Another One Bites the Dust|rock|classic|4|1980|d
Queen|Somebody to Love|rock|classic|3|1976|
Queen|Under Pressure|rock|classic|4|1981|
Queen|Who Wants to Live Forever|rock|soft|1|1986|m
Queen|The Show Must Go On|rock|classic|3|1991|m
Queen|Radio Ga Ga|rock|classic|4|1984|
Queen|I Want to Break Free|rock|classic|4|1984|
David Bowie|Space Oddity|rock|soft|2|1969|
David Bowie|Let's Dance|rock|classic|4|1983|d
David Bowie|Starman|rock|classic|3|1972|
Lynyrd Skynyrd|That Smell|rock|sudiste|4|1977|
ZZ Top|Gimme All Your Lovin'|rock|sudiste|5|1983|d
ZZ Top|Legs|rock|sudiste|5|1983|d
The Outlaws|Green Grass and High Tides|rock|sudiste|4|1975|
.38 Special|Caught Up in You|rock|sudiste|4|1982|
Gov't Mule|Soulshine|rock|sudiste|2|1995|
Drive-By Truckers|Let There Be Rock|rock|sudiste|4|2001|
Kings of Leon|Pyro|rock|inde|2|2010|m
The Strokes|Someday|rock|inde|4|2001|n
The Strokes|Reptilia|rock|inde|5|2003|
Arctic Monkeys|I Bet You Look Good on the Dancefloor|rock|inde|5|2005|d
Arctic Monkeys|505|rock|inde|3|2007|m
Arctic Monkeys|Why'd You Only Call Me When You're High?|rock|inde|3|2013|
The Killers|Somebody Told Me|rock|inde|5|2004|d
The Killers|Human|rock|inde|4|2008|
The Black Keys|Tighten Up|rock|inde|3|2010|
Interpol|Evil|rock|inde|4|2004|
The Libertines|Can't Stand Me Now|rock|inde|4|2004|
Bloc Party|Banquet|rock|inde|5|2005|
Yeah Yeah Yeahs|Maps|rock|inde|3|2003|m
Yeah Yeah Yeahs|Heads Will Roll|rock|inde|5|2009|d
Arcade Fire|Rebellion (Lies)|rock|inde|4|2004|
The National|Bloodbuzz Ohio|rock|inde|3|2010|m
Vampire Weekend|A-Punk|rock|inde|5|2008|j
Vampire Weekend|Oxford Comma|rock|inde|3|2008|
Foals|My Number|rock|inde|4|2013|d
Two Door Cinema Club|What You Know|rock|inde|4|2010|j
The Kooks|Naive|rock|inde|3|2006|
The Kooks|She Moves in Her Own Way|rock|inde|4|2006|j
Kasabian|Fire|rock|inde|4|2009|
Kasabian|Club Foot|rock|inde|5|2004|
Oasis|Champagne Supernova|rock|inde|3|1995|
Oasis|Live Forever|rock|inde|4|1994|
Blur|Coffee & TV|rock|inde|3|1999|
Pulp|Common People|rock|inde|4|1995|
Radiohead|No Surprises|rock|inde|1|1997|m
Radiohead|High and Dry|rock|inde|2|1995|m
The Smiths|There Is a Light That Never Goes Out|rock|inde|3|1986|m
The Smiths|This Charming Man|rock|inde|4|1983|
The Cure|Just Like Heaven|rock|inde|4|1987|r
The Cure|Boys Don't Cry|rock|inde|4|1979|
Joy Division|Love Will Tear Us Apart|rock|inde|4|1980|m
Pixies|Where Is My Mind?|rock|grunge|3|1988|
Pixies|Here Comes Your Man|rock|inde|4|1989|j
R.E.M.|Everybody Hurts|rock|inde|1|1992|m
R.E.M.|Man on the Moon|rock|inde|3|1992|
The Verve|Bitter Sweet Symphony|rock|inde|3|1997|
The Cranberries|Zombie|rock|inde|4|1994|
Nirvana|Come as You Are|rock|grunge|3|1991|
Nirvana|Heart-Shaped Box|rock|hard|4|1993|
Pearl Jam|Black|rock|grunge|2|1991|m
Soundgarden|Black Hole Sun|rock|grunge|3|1994|
Alice in Chains|Man in the Box|rock|grunge|4|1990|
Foo Fighters|The Pretender|rock|hard|5|2007|
Foo Fighters|Times Like These|rock|hard|4|2002|
Red Hot Chili Peppers|Under the Bridge|rock|soft|2|1991|m
Red Hot Chili Peppers|Otherside|rock|classic|3|1999|m
Muse|Supermassive Black Hole|rock|hard|4|2006|
Muse|Hysteria|rock|hard|5|2003|
Muse|Time Is Running Out|rock|hard|5|2003|
Queens of the Stone Age|No One Knows|rock|hard|5|2002|
The Offspring|The Kids Aren't Alright|rock|hard|5|1998|
The Offspring|Self Esteem|rock|punk|5|1994|
Green Day|Basket Case|rock|punk|5|1994|
Green Day|Boulevard of Broken Dreams|rock|hard|3|2004|m
Green Day|Good Riddance (Time of Your Life)|rock|soft|2|1997|n
Green Day|American Idiot|rock|hard|5|2004|
Blink-182|All the Small Things|rock|punk|5|1999|j
Blink-182|I Miss You|rock|inde|3|2003|m
The Cars|Drive|rock|soft|1|1984|m
The Cars|Just What I Needed|rock|classic|4|1978|
Talking Heads|Psycho Killer|rock|inde|4|1977|
Talking Heads|Once in a Lifetime|rock|inde|4|1980|
U2|One|rock|soft|2|1991|
U2|Sunday Bloody Sunday|rock|classic|4|1983|
U2|Beautiful Day|rock|classic|4|2000|j
U2|I Still Haven't Found What I'm Looking For|rock|classic|3|1987|
INXS|Never Tear Us Apart|rock|soft|2|1988|r
Tears for Fears|Mad World|rock|soft|1|1982|m
The Pretenders|Don't Get Me Wrong|rock|classic|4|1986|j
Heart|Barracuda|rock|hard|5|1977|
Heart|Alone|rock|soft|2|1987|r
Pat Benatar|Hit Me with Your Best Shot|rock|classic|5|1980|
Joan Jett & the Blackhearts|I Love Rock 'n' Roll|rock|classic|5|1981|
Survivor|Eye of the Tiger|rock|classic|5|1982|
Jimi Hendrix|All Along the Watchtower|rock|classic|4|1968|
Jimi Hendrix|Purple Haze|rock|classic|4|1967|
Jimi Hendrix|Hey Joe|rock|classic|3|1966|
Cream|Sunshine of Your Love|rock|classic|4|1967|
Santana|Black Magic Woman|rock|classic|3|1970|
Status Quo|Rockin' All Over the World|rock|classic|5|1977|j
T. Rex|Get It On|rock|classic|4|1971|
Thin Lizzy|Whiskey in the Jar|rock|hard|4|1972|
Bad Company|Feel Like Makin' Love|rock|classic|3|1975|
Free|All Right Now|rock|classic|4|1970|
Golden Earring|Radar Love|rock|classic|5|1973|
Steve Miller Band|The Joker|rock|classic|3|1973|
The Doobie Brothers|Listen to the Music|rock|classic|4|1972|j
Bob Seger|Old Time Rock and Roll|rock|classic|4|1978|d
Bob Seger|Turn the Page|rock|soft|2|1973|m
John Mellencamp|Hurts So Good|rock|classic|4|1982|
Meat Loaf|I'd Do Anything for Love (But I Won't Do That)|rock|classic|3|1993|
Meat Loaf|Bat Out of Hell|rock|classic|5|1977|
Mike Oldfield|Moonlight Shadow|rock|soft|3|1983|
The Beach Boys|Good Vibrations|rock|classic|3|1966|j
The Beach Boys|Wouldn't It Be Nice|rock|classic|3|1966|j
Chuck Berry|Johnny B. Goode|rock|classic|5|1958|d
Elvis Presley|Jailhouse Rock|rock|classic|5|1957|d
Elvis Presley|Can't Help Falling in Love|rock|soft|1|1961|r
Elvis Presley|Suspicious Minds|rock|classic|3|1969|
Buddy Holly|Peggy Sue|rock|classic|4|1957|
Bill Haley & His Comets|Rock Around the Clock|rock|classic|5|1954|d
Roy Orbison|Oh, Pretty Woman|rock|classic|4|1964|
Coldplay|Yellow|poprock|2000|2|2000|r
Coldplay|The Scientist|poprock|2000|1|2002|m
Coldplay|Fix You|poprock|2000|2|2005|m
Coldplay|Paradise|poprock|2000|3|2011|
Coldplay|Adventure of a Lifetime|poprock|2000|4|2015|d
Coldplay|Something Just Like This|poprock|2000|4|2017|j
Snow Patrol|Run|poprock|2000|3|2003|
OneRepublic|I Lived|poprock|2000|4|2014|j
Maroon 5|She Will Be Loved|poprock|2000|2|2004|r
Maroon 5|Sunday Morning|poprock|2000|3|2004|j
Train|Drops of Jupiter|poprock|2000|3|2001|
The Script|Hall of Fame|poprock|2000|4|2012|
The Script|The Man Who Can't Be Moved|poprock|2000|3|2008|m
Matchbox Twenty|Unwell|poprock|2000|3|2003|
Matchbox Twenty|3AM|poprock|8090|3|1996|
Goo Goo Dolls|Slide|poprock|8090|4|1998|
Natalie Imbruglia|Torn|poprock|8090|3|1997|m
Alanis Morissette|Hand in My Pocket|poprock|8090|3|1995|
Sheryl Crow|Soak Up the Sun|poprock|2000|4|2002|j
Gin Blossoms|Hey Jealousy|poprock|8090|4|1992|
Counting Crows|Mr. Jones|poprock|8090|4|1993|
Counting Crows|Accidentally in Love|poprock|2000|4|2004|j
Toad the Wet Sprocket|All I Want|poprock|8090|3|1991|
Roxette|Listen to Your Heart|poprock|8090|2|1988|r
A-ha|Hunting High and Low|poprock|8090|2|1985|
Eurythmics|There Must Be an Angel|poprock|8090|3|1985|j
Duran Duran|Ordinary World|poprock|8090|2|1993|m
The Bangles|Eternal Flame|poprock|8090|2|1988|r
The Bangles|Manic Monday|poprock|8090|3|1986|
Cyndi Lauper|Time After Time|poprock|8090|2|1983|r
Huey Lewis and the News|The Power of Love|poprock|8090|4|1985|j
Genesis|Invisible Touch|poprock|8090|4|1986|
Genesis|Land of Confusion|poprock|8090|4|1986|
Peter Gabriel|Solsbury Hill|poprock|8090|3|1977|j
Peter Gabriel|Sledgehammer|poprock|8090|4|1986|d
Simply Red|Holding Back the Years|poprock|8090|1|1985|m
Robbie Williams|Angels|poprock|8090|2|1997|
Robbie Williams|Feel|poprock|2000|2|2002|m
Robbie Williams|Rock DJ|poprock|2000|5|2000|d
Robbie Williams|Millennium|poprock|8090|3|1998|
James Blunt|You're Beautiful|poprock|2000|1|2004|r
James Blunt|1973|poprock|2000|3|2007|n
Kaiser Chiefs|Ruby|poprock|2000|5|2007|
Mika|Grace Kelly|poprock|2000|5|2007|j
Scissor Sisters|I Don't Feel Like Dancin'|poprock|2000|5|2006|d
Avril Lavigne|Sk8er Boi|poprock|2000|5|2002|
Kelly Clarkson|Stronger (What Doesn't Kill You)|poprock|2000|5|2011|j
Pink|So What|poprock|2000|5|2008|
Pink|Just Give Me a Reason|poprock|2000|3|2012|r
Paramore|Still into You|poprock|2000|4|2013|j
Fall Out Boy|Sugar, We're Goin Down|poprock|2000|5|2005|
Imagine Dragons|Radioactive|poprock|actuel|4|2012|
Imagine Dragons|Demons|poprock|actuel|3|2012|m
Imagine Dragons|Enemy|poprock|actuel|5|2021|
Twenty One Pilots|Heathens|poprock|actuel|3|2016|
Bastille|Pompeii|poprock|actuel|4|2013|
Walk the Moon|Shut Up and Dance|poprock|actuel|5|2014|d
Portugal. The Man|Feel It Still|poprock|actuel|4|2017|d
Arctic Monkeys|There'd Better Be a Mirrorball|poprock|actuel|2|2022|m
Olivia Rodrigo|vampire|poprock|actuel|3|2023|m
Harry Styles|Sign of the Times|poprock|actuel|2|2017|m
Indochine|3e sexe|poprock|fr|4|1985|
Indochine|Nos célébrations|poprock|fr|3|2013|
Louise Attaque|Ton invitation|poprock|fr|4|1997|
Superbus|Butterfly|poprock|fr|4|2006|
Saez|Jeune et con|poprock|fr|4|1999|
Eiffel|Place de mon cœur|poprock|fr|3|2002|
Taylor Swift|Blank Space|pop|actuelle|4|2014|
Taylor Swift|Love Story|pop|actuelle|4|2008|r
Taylor Swift|Cruel Summer|pop|actuelle|4|2019|
Ed Sheeran|Thinking Out Loud|pop|actuelle|2|2014|r
Ed Sheeran|Bad Habits|pop|actuelle|4|2021|d
Dua Lipa|New Rules|pop|actuelle|4|2017|
Dua Lipa|Houdini|pop|actuelle|5|2023|d
The Weeknd|Starboy|pop|actuelle|4|2016|
Billie Eilish|What Was I Made For?|pop|actuelle|1|2023|m
Billie Eilish|Ocean Eyes|pop|actuelle|1|2016|m
Ariana Grande|7 rings|pop|actuelle|3|2019|
Ariana Grande|thank u, next|pop|actuelle|3|2018|
Ariana Grande|Into You|pop|actuelle|5|2016|d
Bruno Mars|Uptown Funk|pop|actuelle|5|2014|d
Bruno Mars|Locked Out of Heaven|pop|actuelle|5|2012|d
Bruno Mars|Treasure|pop|actuelle|5|2013|d
Bruno Mars|Die with a Smile|pop|actuelle|2|2024|r
Lady Gaga|Bad Romance|pop|actuelle|5|2009|d
Lady Gaga|Poker Face|pop|actuelle|5|2008|d
Lady Gaga|Shallow|pop|actuelle|2|2018|r
Katy Perry|Firework|pop|actuelle|4|2010|j
Katy Perry|Roar|pop|actuelle|4|2013|j
Katy Perry|Teenage Dream|pop|actuelle|4|2010|
Rihanna|Umbrella|pop|actuelle|4|2007|
Rihanna|Diamonds|pop|actuelle|3|2012|
Rihanna|We Found Love|pop|actuelle|5|2011|d
Rihanna|Only Girl (In the World)|pop|actuelle|5|2010|d
Beyoncé|Halo|pop|actuelle|3|2008|r
Beyoncé|Crazy in Love|pop|actuelle|5|2003|d
Beyoncé|Single Ladies (Put a Ring on It)|pop|actuelle|5|2008|d
Adele|Hello|pop|actuelle|2|2015|m
Adele|Easy on Me|pop|actuelle|1|2021|m
Sia|Cheap Thrills|pop|actuelle|5|2016|d
Miley Cyrus|Wrecking Ball|pop|actuelle|3|2013|m
Lizzo|About Damn Time|pop|actuelle|5|2022|d
Doja Cat|Say So|pop|actuelle|4|2019|d
Sabrina Carpenter|Please Please Please|pop|actuelle|3|2024|
Chappell Roan|Good Luck, Babe!|pop|actuelle|4|2024|
Chappell Roan|Pink Pony Club|pop|actuelle|4|2020|d
Teddy Swims|Lose Control|pop|actuelle|3|2023|
Hozier|Too Sweet|pop|actuelle|3|2024|
Shawn Mendes|Treat You Better|pop|actuelle|4|2016|
Charlie Puth|Attention|pop|actuelle|4|2017|
Justin Bieber|Sorry|pop|actuelle|4|2015|d
Justin Bieber|Love Yourself|pop|actuelle|2|2015|
Justin Bieber|Peaches|pop|actuelle|3|2021|
Post Malone|Sunflower|pop|actuelle|3|2018|j
Calvin Harris|Summer|pop|actuelle|5|2014|d
Clean Bandit|Rather Be|pop|actuelle|4|2014|j
Ellie Goulding|Love Me Like You Do|pop|actuelle|3|2015|r
Sam Smith|Stay with Me|pop|actuelle|1|2014|m
Justin Timberlake|Can't Stop the Feeling!|pop|actuelle|5|2016|j
Justin Timberlake|SexyBack|pop|actuelle|5|2006|d
Michael Jackson|Thriller|pop|8090|5|1982|d
Michael Jackson|Smooth Criminal|pop|8090|5|1987|d
Michael Jackson|Man in the Mirror|pop|8090|3|1987|
Michael Jackson|Black or White|pop|8090|5|1991|d
Madonna|Vogue|pop|8090|5|1990|d
Madonna|La Isla Bonita|pop|8090|3|1987|
Whitney Houston|I Will Always Love You|pop|8090|2|1992|r
Whitney Houston|How Will I Know|pop|8090|4|1985|j
Prince|When Doves Cry|pop|8090|4|1984|
George Michael|Faith|pop|8090|4|1987|
Wham!|Last Christmas|pop|8090|3|1984|n
Tina Turner|The Best|pop|8090|4|1989|j
Tina Turner|What's Love Got to Do with It|pop|8090|3|1984|
Lionel Richie|Hello|pop|8090|1|1984|r
Kim Wilde|Kids in America|pop|8090|5|1981|
Rick Astley|Never Gonna Give You Up|pop|8090|5|1987|d
Belinda Carlisle|Heaven Is a Place on Earth|pop|8090|4|1987|j
Mariah Carey|Hero|pop|8090|2|1993|
Celine Dion|It's All Coming Back to Me Now|pop|8090|3|1996|
Backstreet Boys|Everybody (Backstreet's Back)|pop|8090|5|1997|d
Britney Spears|Toxic|pop|actuelle|5|2003|d
Christina Aguilera|Genie in a Bottle|pop|8090|4|1999|
TLC|Waterfalls|pop|8090|3|1994|
Ace of Base|The Sign|pop|8090|4|1993|d
Aqua|Barbie Girl|pop|8090|5|1997|d
Savage Garden|Truly Madly Deeply|pop|8090|2|1997|r
Hanson|MMMBop|pop|8090|5|1997|j
Cher|Believe|pop|8090|5|1998|d
Gloria Estefan|Conga|pop|8090|5|1985|d
Pet Shop Boys|West End Girls|pop|synth|3|1984|
Pet Shop Boys|It's a Sin|pop|8090|4|1987|
Depeche Mode|Enjoy the Silence|pop|synth|3|1990|
Depeche Mode|Just Can't Get Enough|pop|synth|5|1981|d
Depeche Mode|Personal Jesus|pop|8090|4|1989|
Culture Club|Karma Chameleon|pop|8090|4|1983|j
Kylie Minogue|Can't Get You Out of My Head|pop|actuelle|4|2001|d
Kylie Minogue|Padam Padam|pop|actuelle|4|2023|d
Daft Punk|Harder, Better, Faster, Stronger|electro|house|4|2001|d
Daft Punk|Digital Love|electro|house|4|2001|r
Daft Punk|Instant Crush|electro|synthwave|3|2013|m
Daft Punk|Lose Yourself to Dance|electro|dance|4|2013|d
Cassius|1999|electro|house|5|1999|d
Bob Sinclar|World, Hold On (Children of the Sky)|electro|dance|5|2006|j
David Guetta|When Love Takes Over|electro|dance|5|2009|d
David Guetta|Memories|electro|dance|5|2009|d
David Guetta|I'm Good (Blue)|electro|dance|5|2022|d
Avicii|Hey Brother|electro|dance|5|2013|
Avicii|The Nights|electro|dance|5|2014|j
Avicii|Waiting for Love|electro|dance|5|2015|
Swedish House Mafia|One (Your Name)|electro|house|5|2010|d
Calvin Harris|This Is What You Came For|electro|dance|4|2016|d
Calvin Harris|One Kiss|electro|house|4|2018|d
Martin Garrix|Animals|electro|dance|5|2013|d
Martin Garrix|In the Name of Love|electro|dance|4|2016|
Kygo|Stole the Show|electro|dance|4|2015|
Robin Schulz|Prayer in C|electro|house|4|2014|d
Robin Schulz|Sugar|electro|house|4|2015|d
Lost Frequencies|Are You with Me|electro|house|4|2014|j
Alan Walker|Faded|electro|dance|3|2015|m
The Chainsmokers|Closer|electro|dance|3|2016|
The Chainsmokers|Don't Let Me Down|electro|dance|4|2016|
Zedd|Clarity|electro|dance|4|2012|
Disclosure|You & Me (Flume Remix)|electro|house|4|2013|
Fred again..|Delilah (pull me out of this)|electro|house|4|2022|
Fred again..|Marea (we've lost dancing)|electro|house|4|2021|d
Peggy Gou|(It Goes Like) Nanana|electro|house|5|2023|d
Purple Disco Machine|Hypnotized|electro|house|5|2020|d
Purple Disco Machine|In the Dark|electro|house|4|2022|d
Mousse T.|Horny '98|electro|house|5|1998|d
Eric Prydz|Call on Me|electro|house|5|2004|d
Armand van Helden|You Don't Know Me|electro|house|5|1998|d
Fatboy Slim|Praise You|electro|house|4|1998|j
Fatboy Slim|Right Here, Right Now|electro|house|4|1999|
The Chemical Brothers|Hey Boy Hey Girl|electro|techno|5|1999|d
The Chemical Brothers|Galvanize|electro|techno|5|2004|
The Prodigy|Breathe|electro|techno|5|1996|
The Prodigy|Out of Space|electro|techno|5|1992|d
Moby|Natural Blues|electro|techno|3|1999|
Moby|Extreme Ways|electro|techno|4|2002|
Boris Brejcha|Gravity|electro|techno|4|2015|i
Charlotte de Witte|Doppler|electro|techno|5|2020|i
Amelie Lens|Hypnotized|electro|techno|5|2018|i
Justice|D.A.N.C.E.|electro|dance|5|2007|d
Justice|Genesis|electro|techno|5|2007|i
The Midnight|Days of Thunder|electro|synthwave|3|2014|n
M83|Wait|electro|synthwave|2|2011|m
Phoenix|1901|electro|dance|4|2009|j
Phoenix|Lisztomania|electro|dance|4|2009|
Sébastien Tellier|La Ritournelle|electro|synthwave|2|2004|
Jean-Michel Jarre|Oxygène, Pt. 4|electro|ambient|3|1976|i
Jean-Michel Jarre|Équinoxe, Pt. 5|electro|synthwave|3|1978|i
Kraftwerk|The Model|electro|synthwave|3|1981|
Kraftwerk|Autobahn|electro|synthwave|2|1974|
Giorgio Moroder|Chase|electro|synthwave|4|1978|i
Culture Beat|Mr. Vain|electro|dance|5|1993|d
Faithless|Insomnia|electro|trance|5|1995|
Faithless|God Is a DJ|electro|dance|5|1998|
Gigi D'Agostino|L'amour toujours|electro|dance|5|1999|d
Benny Benassi|Who's Your Daddy?|electro|house|5|2003|d
Eminem|Mockingbird|rap|us|3|2004|m
Eminem|Stan|rap|us|3|2000|m
Eminem|Till I Collapse|rap|us|5|2002|
Eminem|Love the Way You Lie|rap|us|4|2010|
Snoop Dogg|Gin and Juice|hiphop|us|3|1994|
2Pac|Dear Mama|hiphop|us|2|1995|n
The Notorious B.I.G.|Hypnotize|hiphop|us|4|1997|d
Missy Elliott|Get Ur Freak On|hiphop|us|5|2001|d
Kanye West|Gold Digger|rap|us|5|2005|d
50 Cent|In da Club|rap|us|5|2003|d
Kendrick Lamar|Not Like Us|rap|us|5|2024|
Drake|Hotline Bling|rap|us|3|2015|
Travis Scott|goosebumps|rap|us|4|2016|
J. Cole|No Role Modelz|rap|us|4|2014|
Mac Miller|Self Care|rap|us|3|2018|m
Kid Cudi|Pursuit of Happiness|rap|us|4|2009|
Lil Nas X|Industry Baby|rap|us|5|2021|
Doja Cat|Paint the Town Red|rap|us|4|2023|
Beastie Boys|Intergalactic|hiphop|us|5|1998|
Cypress Hill|Insane in the Brain|hiphop|us|5|1993|
Fugees|Ready or Not|hiphop|us|3|1996|
Lauryn Hill|Doo Wop (That Thing)|hiphop|us|4|1998|
IAM|Demain c'est loin|hiphop|fr|3|1997|
MC Solaar|Nouveau western|hiphop|fr|3|1994|
NTM|La Fièvre|hiphop|fr|5|1995|
Diam's|DJ|hiphop|fr|4|2003|
113|Tonton du bled|hiphop|fr|4|1999|j
Booba|Validée|rap|fr|3|2015|
PNL|Onizuka|rap|fr|3|2016|m
Nekfeu|Ma dope|rap|fr|3|2016|
Orelsan|Défaite de famille|rap|fr|4|2017|j
Orelsan|L'odeur de l'essence|rap|fr|4|2021|
Bigflo & Oli|Je suis|rap|fr|4|2017|
Ninho|Lettre à une femme|rap|fr|3|2019|
13 Organisé|Bande organisée|rap|fr|5|2020|
Gazo|DIE|rap|fr|4|2021|
Tiakola|Meuda|rap|fr|4|2022|d
Lomepal|Club|rap|fr|4|2017|
Vald|Désaccordé|rap|fr|4|2017|
Kery James|Lettre à la République|hiphop|fr|4|2012|
Fonky Family|Art de rue|hiphop|fr|4|2001|
Saïan Supa Crew|Angela|hiphop|fr|5|1999|j
Iron Maiden|Wasted Years|metal|heavy|5|1986|
Iron Maiden|Hallowed Be Thy Name|metal|heavy|5|1982|
Iron Maiden|Aces High|metal|heavy|5|1984|
Iron Maiden|2 Minutes to Midnight|metal|heavy|5|1984|
Judas Priest|You've Got Another Thing Comin'|metal|heavy|4|1982|
Black Sabbath|Children of the Grave|metal|heavy|5|1971|
Ozzy Osbourne|Mr. Crowley|metal|heavy|4|1980|
Ozzy Osbourne|Mama, I'm Coming Home|metal|heavy|2|1991|m
Dio|Rainbow in the Dark|metal|heavy|5|1983|
Rainbow|Stargazer|metal|heavy|4|1976|
Saxon|Princess of the Night|metal|heavy|5|1981|
Twisted Sister|We're Not Gonna Take It|metal|heavy|5|1984|
Quiet Riot|Cum On Feel the Noize|metal|heavy|5|1983|
Mötley Crüe|Home Sweet Home|metal|heavy|2|1985|m
Skid Row|Youth Gone Wild|metal|heavy|5|1989|
Skid Row|I Remember You|metal|heavy|2|1989|r
Metallica|One|metal|heavy|4|1988|m
Metallica|Fade to Black|metal|heavy|3|1984|m
Metallica|Seek & Destroy|metal|heavy|5|1983|
Megadeth|Holy Wars... The Punishment Due|metal|heavy|5|1990|
Slayer|Raining Blood|metal|heavy|5|1986|
Anthrax|Madhouse|metal|heavy|5|1985|
Pantera|Walk|metal|heavy|5|1992|
Pantera|Cowboys from Hell|metal|heavy|5|1990|
Pantera|Cemetery Gates|metal|heavy|3|1990|m
Sepultura|Roots Bloody Roots|metal|moderne|5|1996|
Helloween|I Want Out|metal|heavy|5|1988|
Manowar|Warriors of the World United|metal|heavy|5|2002|
Sabaton|Primo Victoria|metal|heavy|5|2005|
Sabaton|The Last Stand|metal|heavy|5|2016|
Powerwolf|Demons Are a Girl's Best Friend|metal|heavy|5|2018|
Ghost|Mary on a Cross|metal|heavy|4|2019|
System of a Down|B.Y.O.B.|metal|moderne|5|2005|
System of a Down|Aerials|metal|moderne|4|2001|
Linkin Park|Faint|metal|moderne|5|2003|
Linkin Park|What I've Done|metal|moderne|4|2007|
Linkin Park|Crawling|metal|moderne|4|2000|m
Linkin Park|The Emptiness Machine|metal|moderne|5|2024|
Korn|Falling Away from Me|metal|moderne|4|1999|
Limp Bizkit|Break Stuff|metal|moderne|5|1999|
Limp Bizkit|Rollin' (Air Raid Vehicle)|metal|moderne|5|2000|
Slipknot|Before I Forget|metal|moderne|5|2004|
Slipknot|Snuff|metal|moderne|2|2008|m
Disturbed|Down with the Sickness|metal|moderne|5|2000|
Disturbed|Indestructible|metal|moderne|5|2008|
Papa Roach|Last Resort|metal|moderne|5|2000|
Deftones|Change (In the House of Flies)|metal|moderne|3|2000|m
Deftones|My Own Summer (Shove It)|metal|moderne|5|1997|
Rammstein|Ich will|metal|moderne|5|2001|
Rammstein|Engel|metal|moderne|4|1997|
Rammstein|Deutschland|metal|moderne|5|2019|
Rammstein|Mein Herz brennt|metal|moderne|4|2001|
Gojira|L'Enfant sauvage|metal|moderne|5|2012|
Gojira|Silvera|metal|moderne|5|2016|
Gojira|Mea culpa (Ah ! Ça ira !)|metal|moderne|5|2024|
Trivium|In Waves|metal|moderne|5|2011|
Avenged Sevenfold|Nightmare|metal|moderne|5|2010|
Five Finger Death Punch|Wrong Side of Heaven|metal|moderne|3|2013|m
Bring Me the Horizon|Can You Feel My Heart|metal|moderne|4|2013|
Bring Me the Horizon|Drown|metal|moderne|4|2014|
Mastodon|Blood and Thunder|metal|moderne|5|2004|
Lamb of God|Redneck|metal|moderne|5|2006|
Tool|Schism|metal|moderne|4|2001|
Tool|Sober|metal|moderne|3|1993|m
Architects|Doomsday|metal|moderne|5|2017|
Sleep Token|The Summoning|metal|moderne|4|2023|
Nightwish|Ghost Love Score|metal|symphonique|4|2004|
Nightwish|Amaranth|metal|symphonique|4|2007|
Nightwish|Storytime|metal|symphonique|5|2011|
Nightwish|Élan|metal|symphonique|3|2015|
Within Temptation|What Have You Done|metal|symphonique|4|2007|
Within Temptation|Faster|metal|symphonique|5|2011|
Epica|Unchain Utopia|metal|symphonique|5|2014|
Evanescence|Going Under|metal|symphonique|4|2003|
Evanescence|Call Me When You're Sober|metal|symphonique|4|2006|
Delain|April Rain|metal|symphonique|4|2009|
Xandria|Ravenheart|metal|symphonique|4|2004|
Rhapsody of Fire|Emerald Sword|metal|symphonique|5|1998|
Sonata Arctica|FullMoon|metal|symphonique|5|1999|
Kamelot|March of Mephisto|metal|symphonique|4|2005|
Amaranthe|The Nexus|metal|symphonique|5|2013|
Beyond the Black|In the Shadows|metal|symphonique|4|2015|
Muddy Waters|Got My Mojo Working|blues|blues|4|1956|
Howlin' Wolf|Smokestack Lightnin'|blues|blues|3|1956|
Howlin' Wolf|Spoonful|blues|blues|3|1960|
John Lee Hooker|One Bourbon, One Scotch, One Beer|blues|blues|3|1966|
B.B. King|Every Day I Have the Blues|blues|blues|3|1955|
B.B. King|Sweet Little Angel|blues|blues|2|1956|
Albert King|Born Under a Bad Sign|blues|blues|3|1967|
Freddie King|Hide Away|blues|blues|4|1961|i
Robert Johnson|Sweet Home Chicago|blues|blues|3|1936|
Elmore James|Dust My Broom|blues|blues|4|1951|
Willie Dixon|I Just Want to Make Love to You|blues|blues|3|1954|
Bo Diddley|Who Do You Love?|blues|blues|4|1956|
Stevie Ray Vaughan|Lenny|blues|blues|1|1983|i
Eric Clapton|Layla|blues|blues|4|1970|
Eric Clapton|Wonderful Tonight|blues|blues|1|1977|r
Eric Clapton|Cocaine|blues|blues|3|1977|
Gary Moore|Parisienne Walkways|blues|blues|2|1978|m
Joe Bonamassa|The Ballad of John Henry|blues|blues|4|2009|
John Mayer|Gravity|blues|blues|2|2006|m
John Mayer|Slow Dancing in a Burning Room|blues|blues|2|2006|m
Beth Hart|I'll Take Care of You|blues|blues|1|2011|r
Keb' Mo'|Am I Wrong|blues|blues|2|1994|
Taj Mahal|She Caught the Katy (And Left Me a Mule to Ride)|blues|blues|3|1968|
Buddy Guy|Damn Right, I've Got the Blues|blues|blues|4|1991|
Rory Gallagher|A Million Miles Away|blues|blues|2|1973|m
Canned Heat|On the Road Again|blues|blues|3|1968|
The Black Keys|Howlin' for You|blues|blues|4|2010|
Seasick Steve|Dog House Boogie|blues|blues|4|2006|
Bob Dylan|The Times They Are a-Changin'|blues|folk|2|1964|
Bob Dylan|Mr. Tambourine Man|blues|folk|2|1965|
Joan Baez|Diamonds & Rust|blues|folk|2|1975|m
Joni Mitchell|Both Sides Now|blues|folk|1|1969|m
Leonard Cohen|Suzanne|blues|folk|1|1967|m
Leonard Cohen|So Long, Marianne|blues|folk|2|1967|m
Leonard Cohen|Famous Blue Raincoat|blues|folk|1|1971|m
Nick Drake|Pink Moon|blues|folk|1|1972|m
Nick Drake|River Man|blues|folk|1|1969|m
Tracy Chapman|Give Me One Reason|blues|folk|3|1995|
Jeff Buckley|Hallelujah|blues|folk|1|1994|m
Jeff Buckley|Lover, You Should've Come Over|blues|folk|2|1994|m
Damien Rice|The Blower's Daughter|blues|folk|1|2001|m
Damien Rice|Cannonball|blues|folk|1|2002|
Iron & Wine|Such Great Heights|blues|folk|1|2004|r
Bon Iver|Holocene|blues|folk|1|2011|m
Fleet Foxes|Mykonos|blues|folk|3|2008|
The Lumineers|Ophelia|blues|folk|3|2016|
The Lumineers|Cleopatra|blues|folk|3|2016|m
José González|Crosses|blues|folk|1|2003|
Ben Howard|Only Love|blues|folk|2|2011|r
Hozier|Cherry Wine|blues|folk|1|2016|m
Phoebe Bridgers|Motion Sickness|blues|folk|3|2017|m
Sufjan Stevens|Mystery of Love|blues|folk|1|2017|r
Sufjan Stevens|Chicago|blues|folk|3|2005|
Angus & Julia Stone|Big Jet Plane|blues|folk|2|2010|r
The Tallest Man on Earth|The Gardener|blues|folk|3|2008|
First Aid Kit|Emmylou|blues|folk|2|2012|r
Simon & Garfunkel|Scarborough Fair / Canticle|blues|folk|1|1966|m
Donovan|Catch the Wind|blues|folk|1|1965|
Cat Power|The Greatest|blues|folk|2|2006|m
Norah Jones|Come Away with Me|blues|folk|1|2002|r
Ray LaMontagne|Trouble|blues|folk|2|2004|
Aretha Franklin|(You Make Me Feel Like) A Natural Woman|soul|soul|2|1967|r
Aretha Franklin|Think|soul|soul|5|1968|
Aretha Franklin|I Say a Little Prayer|soul|soul|3|1968|r
Otis Redding|Try a Little Tenderness|soul|soul|3|1966|r
Sam Cooke|Wonderful World|soul|soul|3|1960|j
Ray Charles|Hit the Road Jack|soul|soul|4|1961|
Ray Charles|What'd I Say|soul|soul|5|1959|d
Ray Charles|Georgia on My Mind|soul|soul|1|1960|n
Marvin Gaye|Sexual Healing|soul|soul|3|1982|r
Bill Withers|Just the Two of Us|soul|soul|2|1980|r
The Temptations|My Girl|soul|soul|3|1964|r
Smokey Robinson & the Miracles|The Tracks of My Tears|soul|soul|3|1965|m
The Supremes|You Can't Hurry Love|soul|soul|4|1966|j
The Supremes|Baby Love|soul|soul|4|1964|r
Martha and the Vandellas|Dancing in the Street|soul|soul|5|1964|d
Percy Sledge|When a Man Loves a Woman|soul|soul|1|1966|r
Wilson Pickett|In the Midnight Hour|soul|soul|4|1965|d
Sam & Dave|Soul Man|soul|soul|5|1967|d
Etta James|Something's Got a Hold on Me|soul|soul|4|1962|
Amy Winehouse|Valerie|soul|soul|4|2007|j
Amy Winehouse|You Know I'm No Good|soul|soul|3|2006|
Leon Bridges|Coming Home|soul|soul|2|2015|r
Michael Kiwanuka|Cold Little Heart|soul|soul|2|2016|m
Michael Kiwanuka|Home Again|soul|soul|1|2012|
Sharon Jones & The Dap-Kings|100 Days, 100 Nights|soul|soul|3|2007|
Charles Bradley|Changes|soul|soul|2|2016|m
Alicia Keys|Fallin'|soul|soul|2|2001|m
Alicia Keys|If I Ain't Got You|soul|soul|2|2003|r
John Legend|All of Me|soul|soul|1|2013|r
Erykah Badu|On & On|soul|soul|3|1997|
D'Angelo|Untitled (How Does It Feel)|soul|soul|2|2000|r
Joss Stone|Right to Be Wrong|soul|soul|2|2004|
Duffy|Mercy|soul|soul|4|2008|d
Adele|Chasing Pavements|soul|soul|2|2008|m
James Brown|Papa's Got a Brand New Bag|soul|funk|5|1965|d
James Brown|It's a Man's Man's Man's World|soul|soul|2|1966|m
Stevie Wonder|Isn't She Lovely|soul|soul|4|1976|j
Stevie Wonder|I Wish|soul|funk|5|1976|d
Stevie Wonder|Signed, Sealed, Delivered I'm Yours|soul|funk|4|1970|j
Earth, Wind & Fire|Boogie Wonderland|soul|disco|5|1979|d
Kool & the Gang|Get Down On It|soul|funk|5|1981|d
Kool & the Gang|Cherish|soul|soul|2|1985|r
Sly & the Family Stone|Everyday People|soul|funk|4|1968|j
Sly & the Family Stone|Dance to the Music|soul|funk|5|1968|d
Funkadelic|One Nation Under a Groove|soul|funk|5|1978|d
Chaka Khan|Ain't Nobody|soul|funk|4|1983|d
Chaka Khan|I'm Every Woman|soul|disco|5|1978|d
Commodores|Brick House|soul|funk|5|1977|d
Commodores|Easy|soul|soul|1|1977|
The Isley Brothers|Shout|soul|funk|5|1959|d
Wild Cherry|Play That Funky Music|soul|funk|5|1976|d
Tower of Power|What Is Hip?|soul|funk|5|1973|d
The Meters|Cissy Strut|soul|funk|4|1969|i
Jamiroquai|Canned Heat|soul|funk|5|1999|d
Jamiroquai|Love Foolosophy|soul|funk|4|2001|d
Vulfpeck|Dean Town|soul|funk|4|2016|i
Prince|1999|soul|funk|5|1982|d
Anderson .Paak|Come Down|soul|funk|5|2016|d
Silk Sonic|Leave the Door Open|soul|soul|2|2021|r
Bee Gees|Night Fever|soul|disco|5|1977|d
Bee Gees|You Should Be Dancing|soul|disco|5|1976|d
Donna Summer|Bad Girls|soul|disco|5|1979|d
Sister Sledge|He's the Greatest Dancer|soul|disco|5|1979|d
The Trammps|Disco Inferno|soul|disco|5|1976|d
Boney M.|Sunny|soul|disco|4|1976|
ABBA|Dancing Queen|soul|disco|5|1976|d
ABBA|Gimme! Gimme! Gimme! (A Man After Midnight)|soul|disco|5|1979|d
ABBA|Voulez-Vous|soul|disco|5|1979|d
Diana Ross|Upside Down|soul|disco|5|1980|d
Diana Ross|I'm Coming Out|soul|disco|5|1980|d
Michael Jackson|Don't Stop 'Til You Get Enough|soul|disco|5|1979|d
Michael Jackson|Rock with You|soul|disco|4|1979|d
The Jacksons|Blame It on the Boogie|soul|disco|5|1978|d
Patrick Hernandez|Born to Be Alive|soul|disco|5|1979|d
Sheila & B. Devotion|Spacer|soul|disco|5|1979|d
Cerrone|Supernature|soul|disco|5|1977|d
Imagination|Just an Illusion|soul|disco|4|1982|d
Lipps Inc.|Funkytown|soul|disco|5|1980|d
KC and the Sunshine Band|Get Down Tonight|soul|disco|5|1975|d
KC and the Sunshine Band|That's the Way (I Like It)|soul|disco|5|1975|d
Earth, Wind & Fire|Fantasy|soul|disco|4|1977|
Dua Lipa|Physical|soul|disco|5|2020|d
Jessie Ware|Free Yourself|soul|disco|5|2023|d
Kylie Minogue|Love at First Sight|soul|disco|5|2002|d
Róisín Murphy|Murphy's Law|soul|disco|4|2020|d
Bob Marley & The Wailers|Redemption Song|reggae|roots|1|1980|
Bob Marley & The Wailers|Stir It Up|reggae|roots|3|1973|r
Bob Marley & The Wailers|Get Up, Stand Up|reggae|roots|4|1973|
Bob Marley & The Wailers|Waiting in Vain|reggae|roots|2|1977|r
Bob Marley & The Wailers|Sun Is Shining|reggae|roots|2|1978|
Peter Tosh|Legalize It|reggae|roots|3|1976|
Peter Tosh|Johnny B. Goode|reggae|roots|4|1983|
Jimmy Cliff|Many Rivers to Cross|reggae|roots|1|1969|m
Toots and the Maytals|54-46 That's My Number|reggae|roots|4|1968|
Desmond Dekker|Israelites|reggae|roots|4|1968|
Burning Spear|Marcus Garvey|reggae|roots|3|1975|
Steel Pulse|Your House|reggae|roots|3|1978|r
Black Uhuru|Guess Who's Coming to Dinner|reggae|roots|3|1979|
UB40|(I Can't Help) Falling in Love with You|reggae|roots|3|1993|r
Inner Circle|Bad Boys|reggae|roots|4|1987|
Chronixx|Here Comes Trouble|reggae|roots|3|2014|
Protoje|Who Knows|reggae|roots|3|2015|
Shaggy|Angel|reggae|dancehall|3|2001|r
Sean Paul|Gimme the Light|reggae|dancehall|5|2002|d
Shabba Ranks|Mr. Loverman|reggae|dancehall|4|1992|
Super Cat|Ghetto Red Hot|reggae|dancehall|5|1992|
Major Lazer|Lean On|reggae|dancehall|4|2015|d
Popcaan|Everything Nice|reggae|dancehall|4|2014|
Vybz Kartel|Fever|reggae|dancehall|4|2011|
Koffee|Toast|reggae|dancehall|4|2019|j
Spice|So Mi Like It|reggae|dancehall|5|2014|d
Tiken Jah Fakoly|Ouvrez les frontières|reggae|fr|3|2007|
Tryo|Désolé pour hier soir|reggae|fr|4|2002|
Louis Armstrong|La Vie en rose|jazz|vocal|1|1950|r
Louis Armstrong|When the Saints Go Marching In|jazz|swing|4|1938|j
Louis Armstrong|Hello, Dolly!|jazz|swing|4|1964|j
Ella Fitzgerald|Cheek to Cheek|jazz|vocal|3|1956|r
Ella Fitzgerald|Dream a Little Dream of Me|jazz|vocal|2|1956|r
Ella Fitzgerald|Mack the Knife|jazz|swing|4|1960|
Frank Sinatra|New York, New York|jazz|swing|4|1980|j
Frank Sinatra|Strangers in the Night|jazz|vocal|2|1966|r
Frank Sinatra|The Way You Look Tonight|jazz|vocal|2|1964|r
Frank Sinatra|Come Fly with Me|jazz|swing|4|1958|j
Frank Sinatra|I've Got You Under My Skin|jazz|swing|3|1956|r
Dean Martin|That's Amore|jazz|vocal|3|1953|j
Dean Martin|Sway|jazz|vocal|3|1954|d
Nat King Cole|Unforgettable|jazz|vocal|1|1951|r
Nat King Cole|L-O-V-E|jazz|vocal|3|1965|j
Billie Holiday|I'll Be Seeing You|jazz|vocal|1|1944|n
Sarah Vaughan|Misty|jazz|vocal|1|1958|r
Chet Baker|Almost Blue|jazz|cool|1|1987|m
Chet Baker|I Fall in Love Too Easily|jazz|cool|1|1954|r
Miles Davis|All Blues|jazz|cool|2|1959|i
Dave Brubeck|Blue Rondo à la Turk|jazz|cool|4|1959|i
Stan Getz|Desafinado|jazz|cool|2|1962|i
John Coltrane|In a Sentimental Mood|jazz|cool|1|1963|i
John Coltrane|Naima|jazz|cool|1|1960|i
John Coltrane|Giant Steps|jazz|moderne|4|1960|i
Bill Evans|Peace Piece|jazz|cool|1|1959|i
Count Basie|April in Paris|jazz|swing|3|1955|i
Glenn Miller|Moonlight Serenade|jazz|swing|1|1939|i
Sidney Bechet|Petite Fleur|jazz|swing|2|1952|i
Art Blakey & The Jazz Messengers|Moanin'|jazz|moderne|4|1958|i
Herbie Hancock|Watermelon Man|jazz|moderne|4|1962|i
Lee Morgan|The Sidewinder|jazz|moderne|4|1964|i
Charles Mingus|Goodbye Pork Pie Hat|jazz|moderne|1|1959|i
Horace Silver|Song for My Father|jazz|moderne|3|1965|i
Wes Montgomery|Bumpin' on Sunset|jazz|cool|2|1966|i
Pat Metheny|Last Train Home|jazz|moderne|2|1987|i
Esbjörn Svensson Trio|From Gagarin's Point of View|jazz|moderne|2|1999|i
Avishai Cohen|Seven Seas|jazz|moderne|3|2011|i
Ibrahim Maalouf|True Sorry|jazz|moderne|3|2011|i
Melody Gardot|Baby I'm a Fool|jazz|vocal|1|2009|r
Gregory Porter|Hey Laura|jazz|vocal|2|2013|r
Michael Bublé|Feeling Good|jazz|vocal|3|2005|
Michael Bublé|Sway|jazz|vocal|4|2004|d
Michael Bublé|Home|jazz|vocal|2|2005|n
Norah Jones|Sunrise|jazz|vocal|1|2004|
Madeleine Peyroux|Dance Me to the End of Love|jazz|vocal|2|2004|r
Stacey Kent|Ces petits riens|jazz|vocal|1|2007|
Ray Charles|Unchain My Heart|jazz|vocal|4|1961|
Buena Vista Social Club|Dos Gardenias|latino|tropical|1|1997|r
Buena Vista Social Club|El Cuarto de Tula|latino|tropical|4|1997|d
Compay Segundo|Guantanamera|latino|tropical|3|1997|
Marc Anthony|Valió la Pena|latino|tropical|4|2004|d
Willie Colón|Idilio|latino|tropical|3|1983|r
Grupo Niche|Cali Pachanguero|latino|tropical|5|1984|d
Joe Arroyo|La Rebelión|latino|tropical|5|1986|d
Carlos Vives|Volví a Nacer|latino|tropical|4|2012|j
Juan Luis Guerra|Burbujas de Amor|latino|tropical|3|1990|r
Juan Luis Guerra|La Bilirrubina|latino|tropical|5|1990|d
Romeo Santos|Propuesta Indecente|latino|tropical|4|2013|d
Aventura|Obsesión|latino|tropical|3|2002|r
Prince Royce|Darte un Beso|latino|tropical|3|2013|r
Gente de Zona|La Gozadera|latino|tropical|5|2015|d
Daddy Yankee|Limbo|latino|reggaeton|5|2012|d
J Balvin|Rojo|latino|reggaeton|3|2020|
Bad Bunny|Me Porto Bonito|latino|reggaeton|4|2022|d
Bad Bunny|Callaita|latino|reggaeton|3|2019|
Ozuna|Taki Taki|latino|reggaeton|5|2018|d
Karol G|Provenza|latino|reggaeton|3|2022|
Maluma|Felices los 4|latino|reggaeton|4|2017|d
Nicky Jam|El Amante|latino|reggaeton|4|2017|d
Don Omar|Danza Kuduro|latino|reggaeton|5|2010|d
Rauw Alejandro|Todo de Ti|latino|reggaeton|4|2021|d
Feid|Normal|latino|reggaeton|3|2022|
Shakira|Waka Waka (This Time for Africa)|latino|pop|5|2010|j
Shakira|La Tortura|latino|pop|4|2005|d
Shakira|Chantaje|latino|pop|4|2016|d
Enrique Iglesias|Hero|latino|pop|2|2001|r
Ricky Martin|La Copa de la Vida|latino|pop|5|1998|j
Ricky Martin|María|latino|pop|5|1995|d
Jennifer Lopez|On the Floor|latino|pop|5|2011|d
Juanes|A Dios le Pido|latino|pop|4|2002|j
Camila Cabello|Señorita|latino|pop|4|2019|d
Rosalía|Despechá|latino|pop|4|2022|d
Rosalía|Con Altura|latino|reggaeton|4|2019|d
Paco de Lucía|Río Ancho|latino|flamenco|3|1981|i
Camarón de la Isla|La Leyenda del Tiempo|latino|flamenco|3|1979|
Ketama|No Estamos Lokos|latino|flamenco|4|1995|
Chico & the Gypsies|Volare|latino|flamenco|4|2014|j
Kendji Girac|Les yeux de la mama|latino|flamenco|3|2015|
Johann Sebastian Bach|Toccata and Fugue in D Minor, BWV 565|classique|baroque|4|1708|i
Johann Sebastian Bach|Cello Suite No. 1 in G Major: Prelude|classique|baroque|2|1720|i
Johann Sebastian Bach|Brandenburg Concerto No. 3: I. Allegro|classique|baroque|4|1721|i
Johann Sebastian Bach|Jesu, Joy of Man's Desiring|classique|baroque|1|1723|i
Johann Sebastian Bach|Goldberg Variations: Aria|classique|baroque|1|1741|i
Antonio Vivaldi|The Four Seasons: Summer, Presto|classique|baroque|5|1725|i
George Frideric Handel|Messiah: Hallelujah|classique|baroque|4|1741|
George Frideric Handel|Arrival of the Queen of Sheba|classique|baroque|4|1749|i
George Frideric Handel|Water Music: Alla Hornpipe|classique|baroque|4|1717|i
Henry Purcell|Dido's Lament|classique|baroque|1|1689|m
Jean-Philippe Rameau|Les Sauvages|classique|baroque|4|1735|i
Wolfgang Amadeus Mozart|Eine kleine Nachtmusik: I. Allegro|classique|romantique|4|1787|i
Wolfgang Amadeus Mozart|Requiem: Lacrimosa|classique|romantique|1|1791|m
Wolfgang Amadeus Mozart|Piano Sonata No. 11: Rondo alla Turca|classique|romantique|4|1783|i
Wolfgang Amadeus Mozart|Symphony No. 40: I. Molto allegro|classique|romantique|4|1788|i
Wolfgang Amadeus Mozart|Piano Concerto No. 21: II. Andante|classique|romantique|1|1785|i
Ludwig van Beethoven|Symphony No. 5: I. Allegro con brio|classique|romantique|5|1808|i
Ludwig van Beethoven|Moonlight Sonata: I. Adagio sostenuto|classique|romantique|1|1801|m
Ludwig van Beethoven|Symphony No. 9: Ode to Joy|classique|romantique|4|1824|j
Ludwig van Beethoven|Symphony No. 7: II. Allegretto|classique|romantique|2|1812|i
Frédéric Chopin|Ballade No. 1 in G Minor|classique|romantique|3|1835|i
Frédéric Chopin|Waltz in C-sharp Minor, Op. 64 No. 2|classique|romantique|2|1847|i
Frédéric Chopin|Prelude in E Minor, Op. 28 No. 4|classique|romantique|1|1839|m
Frédéric Chopin|Polonaise in A-flat Major, Op. 53|classique|romantique|4|1842|i
Franz Liszt|Liebestraum No. 3|classique|romantique|1|1850|i
Franz Liszt|La Campanella|classique|romantique|4|1851|i
Franz Schubert|Ave Maria|classique|romantique|1|1825|
Franz Schubert|Serenade (Ständchen)|classique|romantique|1|1828|i
Pyotr Ilyich Tchaikovsky|Swan Lake: Scene|classique|romantique|3|1876|i
Pyotr Ilyich Tchaikovsky|The Nutcracker: Dance of the Sugar Plum Fairy|classique|romantique|2|1892|i
Pyotr Ilyich Tchaikovsky|The Nutcracker: Waltz of the Flowers|classique|romantique|3|1892|i
Pyotr Ilyich Tchaikovsky|1812 Overture|classique|romantique|5|1880|i
Pyotr Ilyich Tchaikovsky|Piano Concerto No. 1: I. Allegro non troppo|classique|romantique|4|1875|i
Antonín Dvořák|Symphony No. 9 "From the New World": IV. Allegro con fuoco|classique|romantique|5|1893|i
Johannes Brahms|Wiegenlied (Lullaby)|classique|romantique|1|1868|i
Edvard Grieg|Morning Mood|classique|romantique|1|1875|i
Felix Mendelssohn|Wedding March|classique|romantique|4|1842|j
Johann Strauss II|The Blue Danube|classique|romantique|3|1867|i
Jacques Offenbach|Orpheus in the Underworld: Can-Can|classique|romantique|5|1858|d
Camille Saint-Saëns|The Carnival of the Animals: The Swan|classique|romantique|1|1886|i
Camille Saint-Saëns|Danse macabre|classique|romantique|4|1874|i
Gabriel Fauré|Pavane|classique|romantique|1|1887|i
Gabriel Fauré|Requiem: Pie Jesu|classique|lyrique|1|1890|
Jules Massenet|Thaïs: Méditation|classique|romantique|1|1894|i
Sergei Rachmaninoff|Piano Concerto No. 2: I. Moderato|classique|romantique|3|1901|i
Sergei Rachmaninoff|Rhapsody on a Theme of Paganini: Variation 18|classique|romantique|2|1934|r
Claude Debussy|Rêverie|classique|moderne|1|1890|i
Claude Debussy|Arabesque No. 1|classique|moderne|1|1888|i
Maurice Ravel|Pavane pour une infante défunte|classique|moderne|1|1899|m
Erik Satie|Gnossienne No. 1|classique|moderne|1|1890|i
Gustav Holst|The Planets: Jupiter|classique|moderne|4|1916|i
Gustav Holst|The Planets: Mars|classique|moderne|5|1916|i
Carl Orff|Carmina Burana: O Fortuna|classique|moderne|5|1937|
Sergei Prokofiev|Romeo and Juliet: Dance of the Knights|classique|moderne|4|1935|i
Igor Stravinsky|The Rite of Spring: Danses des adolescentes|classique|moderne|5|1913|i
Max Richter|Spring 1|classique|moderne|3|2012|i
Ludovico Einaudi|Una Mattina|classique|moderne|1|2004|i
Ólafur Arnalds|Saman|classique|moderne|1|2013|i
Nils Frahm|Says|classique|moderne|2|2013|i
Giacomo Puccini|Turandot: Nessun dorma|classique|lyrique|3|1926|
Giacomo Puccini|Gianni Schicchi: O mio babbino caro|classique|lyrique|1|1918|r
Giacomo Puccini|La Bohème: Che gelida manina|classique|lyrique|2|1896|r
Giuseppe Verdi|La Traviata: Libiamo ne' lieti calici|classique|lyrique|4|1853|j
Giuseppe Verdi|Nabucco: Va, pensiero|classique|lyrique|2|1842|
Giuseppe Verdi|Rigoletto: La donna è mobile|classique|lyrique|4|1851|j
Giuseppe Verdi|Requiem: Dies irae|classique|lyrique|5|1874|
Georges Bizet|Carmen: Habanera|classique|lyrique|3|1875|
Georges Bizet|Carmen: Toreador Song|classique|lyrique|4|1875|
Léo Delibes|Lakmé: Flower Duet|classique|lyrique|1|1883|
Wolfgang Amadeus Mozart|The Magic Flute: Queen of the Night Aria|classique|lyrique|4|1791|
Gioachino Rossini|The Barber of Seville: Largo al factotum|classique|lyrique|5|1816|j
Gioachino Rossini|William Tell Overture: Finale|classique|romantique|5|1829|i
Andrea Bocelli|Con te partirò|classique|lyrique|2|1995|r
Andrea Bocelli|Time to Say Goodbye|classique|lyrique|3|1996|
Luciano Pavarotti|Nessun dorma|classique|lyrique|3|1990|
Maria Callas|Casta diva|classique|lyrique|1|1954|
Hans Zimmer|He's a Pirate|bo|films|5|2003|i
Hans Zimmer|No Time for Caution|bo|epique|4|2014|i
Hans Zimmer|Dream Is Collapsing|bo|epique|4|2010|i
Hans Zimmer|This Land|bo|films|2|1994|i
Hans Zimmer|Circle of Life|bo|films|4|1994|
Hans Zimmer|Supermarine|bo|epique|4|2017|i
Hans Zimmer|Paul's Dream|bo|films|3|2021|i
John Williams|The Imperial March|bo|epique|4|1980|i
John Williams|Raiders March|bo|epique|5|1981|i
John Williams|Schindler's List Theme|bo|films|1|1993|m
Howard Shore|The Breaking of the Fellowship|bo|films|2|2001|m
Howard Shore|The Bridge of Khazad-dûm|bo|epique|5|2001|
Ennio Morricone|L'Estasi dell'oro|bo|films|4|1966|i
Ennio Morricone|Once Upon a Time in the West|bo|films|2|1968|m
Ennio Morricone|Gabriel's Oboe|bo|films|1|1986|i
Ennio Morricone|Cinema Paradiso|bo|films|1|1988|n
Klaus Badelt|Pirates of the Caribbean: The Medallion Calls|bo|epique|5|2003|i
James Horner|Braveheart: For the Love of a Princess|bo|films|1|1995|m
James Horner|Titanic: Hymn to the Sea|bo|films|1|1997|m
Alan Silvestri|The Avengers|bo|epique|5|2012|i
Alan Silvestri|Back to the Future|bo|films|4|1985|i
Danny Elfman|Batman Theme|bo|epique|4|1989|i
Danny Elfman|The Simpsons Theme|bo|series|4|1989|j
Kyle Dixon & Michael Stein|Stranger Things Main Theme|bo|series|3|2016|i
Bear McCreary|The Walking Dead Main Title|bo|series|3|2010|i
Jeff Beal|House of Cards Main Title Theme|bo|series|3|2013|i
Ludwig Göransson|The Mandalorian|bo|series|4|2019|i
Ludwig Göransson|Can You Hear the Music|bo|films|3|2023|i
Hildur Guðnadóttir|Bathroom Dance|bo|films|2|2019|m
Yann Tiersen|La Valse d'Amélie|bo|films|2|2001|i
Joe Hisaishi|Summer|bo|films|3|1999|i
Joe Hisaishi|Path of the Wind|bo|films|2|1988|i
Thomas Newman|American Beauty|bo|films|2|1999|i
Thomas Bergersen|Heart of Courage|bo|epique|5|2008|i
Audiomachine|Breath and Life|bo|epique|4|2012|i
Michael Giacchino|Married Life|bo|films|1|2009|n
Ennio Morricone|Chi Mai|bo|films|1|1981|m
Richard Sanderson|Reality|bo|films|2|1980|r
Francis Lai|Un homme et une femme|bo|films|2|1966|r
Koji Kondo|Super Mario Bros. Theme|bo|jeux|5|1985|j
Koji Kondo|The Legend of Zelda Main Theme|bo|jeux|4|1986|i
Nobuo Uematsu|Aerith's Theme|bo|jeux|1|1997|m
Yoko Shimomura|Dearly Beloved|bo|jeux|1|2002|i
Jeremy Soule|Secunda|bo|jeux|1|2011|i
Martin O'Donnell|Halo Theme|bo|jeux|4|2001|i
Bear McCreary|God of War|bo|jeux|5|2018|
Lena Raine|Resurrections|bo|jeux|4|2018|i
Toby Fox|Megalovania|bo|jeux|5|2015|i
Darren Korb|In the Arms of the Sea|bo|jeux|3|2011|
C418|Wet Hands|bo|jeux|1|2011|i
Kow Otani|Shadow of the Colossus: The Opened Way|bo|jeux|5|2005|i
Nujabes|Luv(sic) Pt. 3|lofi|lofi|2|2008|
Nujabes|Reflection Eternal|lofi|lofi|2|2003|i
J Dilla|Workinonit|lofi|lofi|3|2006|i
Jinsang|Affection|lofi|lofi|1|2016|i
idealism|Snowfall|lofi|lofi|1|2016|i
Kupla|Owls of the Night|lofi|lofi|1|2018|i
DJ Okawari|Flower Dance|lofi|lofi|2|2009|i
Uyama Hiroto|Waltz for Life Will Born|lofi|lofi|2|2008|i
Bonobo|Kong|lofi|downtempo|3|2010|i
Bonobo|Cirrus|lofi|downtempo|3|2013|i
Bonobo|Black Sands|lofi|downtempo|2|2010|i
Portishead|Sour Times|lofi|downtempo|2|1994|m
Tycho|Dive|lofi|chillelectro|2|2011|i
Boards of Canada|Roygbiv|lofi|chillelectro|2|1998|i
Four Tet|Morning Side|lofi|chillelectro|3|2019|i
Rüfüs Du Sol|Innerbloom|lofi|chillelectro|3|2015|
ODESZA|A Moment Apart|lofi|chillelectro|3|2017|i
Flume|Never Be Like You|lofi|chillelectro|3|2016|
Jon Hopkins|Emerald Rush|lofi|chillelectro|3|2018|i
Rival Consoles|Persona|lofi|chillelectro|3|2018|i
Parcels|Tieduprightnow|lofi|chillelectro|4|2018|d
Polo & Pan|Nanã|lofi|chillelectro|4|2017|d
Fakear|La Lune rousse|lofi|chillelectro|3|2014|i
BTS|Boy with Luv|asie|kpop|5|2019|j
BTS|Spring Day|asie|kpop|3|2017|m
BTS|DNA|asie|kpop|5|2017|d
BLACKPINK|Pink Venom|asie|kpop|5|2022|d
BLACKPINK|Kill This Love|asie|kpop|5|2019|d
TWICE|TT|asie|kpop|5|2016|j
NewJeans|Ditto|asie|kpop|3|2022|n
IVE|I AM|asie|kpop|5|2023|
aespa|Next Level|asie|kpop|5|2021|
Stray Kids|God's Menu|asie|kpop|5|2020|
SEVENTEEN|Very Nice|asie|kpop|5|2016|j
EXO|Growl|asie|kpop|4|2013|d
IU|Blueming|asie|kpop|4|2019|j
IU|Good Day|asie|kpop|4|2010|j
Red Velvet|Psycho|asie|kpop|4|2019|
(G)I-DLE|Tomboy|asie|kpop|5|2022|
LE SSERAFIM|ANTIFRAGILE|asie|kpop|5|2022|d
Jung Kook|Seven|asie|kpop|4|2023|d
Jimin|Like Crazy|asie|kpop|4|2023|
Fifty Fifty|Cupid|asie|kpop|4|2023|j
YOASOBI|Gunjou|asie|jpop|4|2020|j
Kenshi Yonezu|Peace Sign|asie|anime|5|2017|
Fujii Kaze|Matsuri|asie|jpop|3|2021|
Ado|New Genesis|asie|anime|5|2022|j
Vaundy|Kaiju no Hanauta|asie|jpop|4|2020|
Utada Hikaru|One Last Kiss|asie|anime|3|2021|m
Aimer|Kataomoi|asie|jpop|1|2016|m
LiSA|Homura|asie|anime|4|2020|m
RADWIMPS|Zenzenzense|asie|anime|5|2016|
RADWIMPS|Sparkle|asie|anime|3|2016|r
Mrs. GREEN APPLE|Ao to Natsu|asie|jpop|5|2018|j
ONE OK ROCK|The Beginning|asie|jpop|5|2012|
Hikaru Utada & Skrillex|Face My Fears|asie|anime|4|2019|
Tatsuro Yamashita|Sparkle|asie|citypop|4|1982|j
Junko Yagami|Bay City|asie|citypop|4|1983|
Toshiki Kadomatsu|Sea Line|asie|citypop|3|1985|
Fela Kuti|Zombie|monde|afro|5|1976|
Burna Boy|Ye|monde|afro|4|2018|d
Burna Boy|On the Low|monde|afro|4|2018|r
Wizkid|Ojuelegba|monde|afro|3|2014|
CKay|Love Nwantiti (Ah Ah Ah)|monde|afro|4|2019|d
Asake|Lonely at the Top|monde|afro|4|2023|
Master KG|Jerusalema|monde|afro|4|2019|j
Miriam Makeba|Pata Pata|monde|afro|4|1967|d
Salif Keita|Madan|monde|afro|5|1999|d
Amadou & Mariam|Beaux dimanches|monde|afro|3|2004|j
Amadou & Mariam|Sabali|monde|afro|3|2008|
Youssou N'Dour|7 Seconds|monde|afro|2|1994|
Oumou Sangaré|Kounadya|monde|afro|4|2017|
Fatoumata Diawara|Nterini|monde|afro|3|2018|
Ali Farka Touré|Diaraby|monde|afro|2|1994|
Tinariwen|Cler Achel|monde|afro|3|2007|
Bombino|Akhar Zaman|monde|afro|4|2016|
Cheb Mami|Desert Rose|monde|orient|3|1999|
Rachid Taha|Rock el Casbah|monde|orient|5|2004|
Natacha Atlas|Mon amie la rose|monde|orient|2|1999|m
Fairuz|Li Beirut|monde|orient|1|1987|m
Oum Kalthoum|Enta Omri|monde|orient|2|1964|r
Tarkan|Şımarık (Kiss Kiss)|monde|orient|5|1997|d
Mustafa Sandal|Araba|monde|orient|4|2004|d
Ibrahim Maalouf|Beirut|monde|orient|3|2011|i
Jorge Ben Jor|Mas Que Nada|monde|bresil|4|1963|d
Antônio Carlos Jobim|Águas de Março|monde|bresil|2|1972|
Astrud Gilberto|The Girl from Ipanema|monde|bresil|2|1964|
Caetano Veloso|Sozinho|monde|bresil|1|1998|r
Gilberto Gil|Toda Menina Baiana|monde|bresil|4|1979|j
Seu Jorge|Burguesinha|monde|bresil|4|2007|d
Seu Jorge|Carolina|monde|bresil|3|2005|r
Marisa Monte|Ainda Bem|monde|bresil|2|2011|r
Tim Maia|Você|monde|bresil|3|1971|r
Céu|Malemolência|monde|bresil|2|2005|
Vinicius de Moraes|Samba da Bênção|monde|bresil|2|1967|
Nusrat Fateh Ali Khan|Tumhe Dillagi|monde|inde|3|1988|
Shreya Ghoshal|Teri Ore|monde|inde|2|2008|r
Diljit Dosanjh|Lover|monde|inde|4|2021|r
Badshah|Genda Phool|monde|inde|5|2020|d
Tame Impala|Let It Happen|poprock|actuel|4|2015|
Tame Impala|Borderline|poprock|actuel|4|2019|
The 1975|Somebody Else|poprock|actuel|3|2016|m
The 1975|Chocolate|poprock|actuel|4|2013|
The 1975|About You|poprock|actuel|2|2022|r
Florence + the Machine|Dog Days Are Over|poprock|2000|4|2008|j
Florence + the Machine|Shake It Out|poprock|2000|4|2011|
Florence + the Machine|You've Got the Love|poprock|2000|4|2009|j
Lana Del Rey|Summertime Sadness|poprock|actuel|3|2012|m
Lana Del Rey|Video Games|poprock|actuel|1|2011|m
Lana Del Rey|Young and Beautiful|poprock|actuel|1|2013|m
Lorde|Royals|poprock|actuel|3|2013|
Lorde|Green Light|poprock|actuel|4|2017|d
Lorde|Team|poprock|actuel|4|2013|
Of Monsters and Men|Dirty Paws|poprock|actuel|3|2011|
Foster the People|Pumped Up Kicks|poprock|actuel|4|2010|
MGMT|Kids|poprock|2000|4|2007|d
MGMT|Electric Feel|poprock|2000|4|2007|d
Empire of the Sun|Walking on a Dream|poprock|2000|4|2008|j
Passion Pit|Take a Walk|poprock|actuel|4|2012|
Capital Cities|Safe and Sound|poprock|actuel|4|2011|j
Milky Chance|Stolen Dance|poprock|actuel|3|2013|
Mumford & Sons|The Cave|poprock|2000|4|2009|
George Ezra|Budapest|poprock|actuel|3|2014|j
George Ezra|Shotgun|poprock|actuel|4|2018|j
James Bay|Hold Back the River|poprock|actuel|3|2014|
Tom Odell|Another Love|poprock|actuel|2|2012|m
Dermot Kennedy|Outnumbered|poprock|actuel|3|2019|
Sam Fender|Seventeen Going Under|poprock|actuel|4|2021|n
Fontaines D.C.|Starburster|poprock|actuel|4|2024|
The Last Dinner Party|Nothing Matters|poprock|actuel|4|2023|
Wet Leg|Chaise Longue|poprock|actuel|4|2021|
Gracie Abrams|That's So True|poprock|actuel|3|2024|
Djo|End of Beginning|poprock|actuel|3|2022|n
Cage the Elephant|Cigarette Daydreams|poprock|actuel|3|2013|m
The Neighbourhood|Sweater Weather|poprock|actuel|3|2012|r
Arctic Monkeys|Fluorescent Adolescent|poprock|2000|4|2007|n
The Wombats|Let's Dance to Joy Division|poprock|2000|5|2007|d
Phoenix|If I Ever Feel Better|poprock|2000|4|2000|
Hoshi|Ta marinière|poprock|fr|4|2018|
Hoshi|Amour censure|poprock|fr|3|2020|
Feu! Chatterton|La Malinche|poprock|fr|3|2015|
Feu! Chatterton|Un monde nouveau|poprock|fr|3|2021|
Pomme|Anxiété|poprock|fr|2|2019|m
Fauve|Blizzard|poprock|fr|4|2013|
Lilly Wood and the Prick|Prayer in C|poprock|fr|3|2010|
Christine and the Queens|Saint Claude|poprock|fr|3|2014|
Christine and the Queens|Tilted|poprock|fr|3|2015|
Izia|La Vague|poprock|fr|4|2015|
Mademoiselle K|Ça me vexe|poprock|fr|4|2006|
Miossec|Brest|poprock|fr|3|2004|n
Indochine|Un été français|poprock|fr|3|2017|
Olivia Rodrigo|drivers license|pop|actuelle|2|2021|m
Olivia Rodrigo|deja vu|pop|actuelle|3|2021|
Taylor Swift|Style|pop|actuelle|4|2014|
Taylor Swift|cardigan|pop|actuelle|2|2020|m
Taylor Swift|Fortnight|pop|actuelle|2|2024|m
Dua Lipa|Training Season|pop|actuelle|4|2024|d
Dua Lipa|IDGAF|pop|actuelle|4|2017|
The Weeknd|Die for You|pop|actuelle|3|2016|r
The Weeknd|Can't Feel My Face|pop|actuelle|5|2015|d
Harry Styles|Adore You|pop|actuelle|3|2019|r
Harry Styles|Late Night Talking|pop|actuelle|4|2022|j
Ariana Grande|we can't be friends (wait for your love)|pop|actuelle|3|2024|m
Ariana Grande|positions|pop|actuelle|3|2020|r
Billie Eilish|LUNCH|pop|actuelle|4|2024|
Billie Eilish|Happier Than Ever|pop|actuelle|3|2021|m
Lady Gaga|Abracadabra|pop|actuelle|5|2025|d
Lady Gaga|Rain on Me|pop|actuelle|5|2020|d
SZA|Kill Bill|pop|actuelle|3|2022|
SZA|Snooze|pop|actuelle|2|2022|r
SZA|Saturn|pop|actuelle|2|2024|
Tate McRae|greedy|pop|actuelle|4|2023|d
Tate McRae|Sports car|pop|actuelle|4|2025|d
Charli XCX|360|pop|actuelle|5|2024|d
Charli XCX|Apple|pop|actuelle|4|2024|d
Troye Sivan|Rush|pop|actuelle|5|2023|d
Raye|Escapism.|pop|actuelle|4|2022|
Raye|Where Is My Husband!|pop|actuelle|4|2025|
Doechii|Anxiety|pop|actuelle|4|2025|
Gracie Abrams|I Love You, I'm Sorry|pop|actuelle|3|2024|m
Sombr|Back to Friends|pop|actuelle|3|2025|m
Alex Warren|Ordinary|pop|actuelle|3|2025|r
Tyla|Push 2 Start|pop|actuelle|4|2024|d
Jung Kook|Standing Next to You|pop|actuelle|5|2023|d
Kenya Grace|Strangers|pop|actuelle|4|2023|
Selena Gomez|Lose You to Love Me|pop|actuelle|2|2019|m
Halsey|Without Me|pop|actuelle|3|2018|m
Khalid|Talk|pop|actuelle|3|2019|
Lewis Capaldi|Before You Go|pop|actuelle|2|2019|m
Shawn Mendes|There's Nothing Holdin' Me Back|pop|actuelle|5|2017|j
Camila Cabello|Never Be the Same|pop|actuelle|3|2017|
Imagine Dragons|Bones|pop|actuelle|4|2022|
Ava Max|Sweet but Psycho|pop|actuelle|5|2018|d
Meghan Trainor|All About That Bass|pop|actuelle|5|2014|j
Jason Derulo|Want to Want Me|pop|actuelle|5|2015|d
Sia|Unstoppable|pop|actuelle|4|2016|
Zara Larsson|Lush Life|pop|actuelle|5|2015|d
Måneskin|Zitti e buoni|pop|actuelle|5|2021|
Mahmood|Soldi|pop|actuelle|3|2019|
Loreen|Tattoo|pop|actuelle|4|2023|
Loreen|Euphoria|pop|actuelle|5|2012|d
Nemo|The Code|pop|actuelle|4|2024|
Fred again..|adore u|electro|house|5|2023|d
Fred again..|Rumble|electro|techno|5|2024|
John Summit|Where You Are|electro|house|5|2023|d
Dom Dolla|Saving Up|electro|house|5|2023|d
Dom Dolla|San Frandisco|electro|house|5|2019|d
Chris Lake|Turn Off the Lights|electro|house|5|2018|d
Meduza|Piece of Your Heart|electro|house|4|2019|d
Meduza|Lose Control|electro|house|4|2019|d
Joel Corry|Head & Heart|electro|dance|5|2020|d
Tiësto|The Business|electro|dance|5|2020|d
Tiësto|Adagio for Strings|electro|trance|5|2004|i
Armin van Buuren|Blah Blah Blah|electro|dance|5|2018|d
Armin van Buuren|This Is What It Feels Like|electro|trance|4|2013|
Above & Beyond|Sun & Moon|electro|trance|4|2011|
Deadmau5|Strobe|electro|techno|3|2009|i
Deadmau5|Ghosts 'n' Stuff|electro|house|5|2008|d
Kaskade|Atmosphere|electro|house|4|2013|
Skrillex|Bangarang|electro|dance|5|2011|
Skrillex|Scary Monsters and Nice Sprites|electro|dance|5|2010|
Porter Robinson|Language|electro|dance|4|2012|
Porter Robinson|Shelter|electro|dance|3|2016|n
Madeon|Pop Culture|electro|dance|5|2011|i
Madeon|The City|electro|dance|4|2012|
Major Lazer|Light It Up|electro|dance|5|2015|d
DJ Snake|Turn Down for What|electro|dance|5|2013|
DJ Snake|Taki Taki|electro|dance|5|2018|d
DJ Snake|Let Me Love You|electro|dance|4|2016|
Kungs|This Girl|electro|house|4|2016|d
Martin Solveig|Intoxicated|electro|house|5|2015|d
Klingande|Jubel|electro|house|4|2013|i
Jax Jones|You Don't Know Me|electro|house|5|2016|d
Kölsch|Grey|electro|techno|3|2015|i
Âme|Rej|electro|techno|4|2006|i
Mind Against|Atlant|electro|techno|4|2015|i
Anyma|Eternity|electro|techno|4|2023|
Bicep|Glue|electro|techno|4|2017|i
Bicep|Atlas|electro|techno|4|2020|i
Röyksopp|Eple|electro|synthwave|3|2001|i
Röyksopp|What Else Is There?|electro|synthwave|3|2005|m
The Weeknd|Out of Time|electro|synthwave|3|2022|
The Midnight|Lost Boy|electro|synthwave|3|2018|n
Kendrick Lamar|luther|rap|us|3|2024|r
Kendrick Lamar|DNA.|rap|us|5|2017|
Kendrick Lamar|Money Trees|rap|us|3|2012|
Kendrick Lamar|Swimming Pools (Drank)|rap|us|4|2012|
Travis Scott|FE!N|rap|us|5|2023|
Drake|One Dance|rap|us|4|2016|d
Drake|Started from the Bottom|rap|us|4|2013|
Future|Mask Off|rap|us|3|2017|
Metro Boomin|Creepin'|rap|us|3|2022|
21 Savage|a lot|rap|us|3|2018|
Tyler, the Creator|EARFQUAKE|rap|us|3|2019|r
Tyler, the Creator|See You Again|rap|us|3|2017|r
Childish Gambino|Redbone|rap|us|2|2016|
Childish Gambino|This Is America|rap|us|4|2018|
A$AP Rocky|Praise the Lord (Da Shine)|rap|us|4|2018|
Juice WRLD|Lucid Dreams|rap|us|3|2018|m
XXXTENTACION|SAD!|rap|us|3|2018|m
Lil Wayne|Lollipop|rap|us|4|2008|
Nelly|Hot in Herre|rap|us|5|2002|d
Ludacris|Stand Up|rap|us|5|2003|d
Macklemore & Ryan Lewis|Can't Hold Us|rap|us|5|2011|j
Macklemore & Ryan Lewis|Thrift Shop|rap|us|4|2012|j
Logic|1-800-273-8255|rap|us|3|2017|
Mos Def|Ms. Fat Booty|hiphop|us|4|1999|
A Tribe Called Quest|Can I Kick It?|hiphop|us|4|1990|
De La Soul|Me Myself and I|hiphop|us|4|1989|j
Gang Starr|Mass Appeal|hiphop|us|3|1994|
Common|The Light|hiphop|us|2|2000|r
Doechii|DENIAL IS A RIVER|rap|us|4|2024|
GloRilla|TGIF|rap|us|5|2024|
Megan Thee Stallion|Savage|rap|us|5|2020|d
Cardi B|Bodak Yellow|rap|us|5|2017|
Nicki Minaj|Super Bass|rap|us|5|2011|d
Ice Cube|It Was a Good Day|hiphop|us|3|1992|n
Warren G|Regulate|hiphop|us|3|1994|
Naughty by Nature|O.P.P.|hiphop|us|5|1991|d
Salt-N-Pepa|Push It|hiphop|us|5|1987|d
Orelsan|La quête|rap|fr|3|2017|n
Orelsan|Tout va bien|rap|fr|3|2017|
Nekfeu|Égérie|rap|fr|3|2016|r
Nekfeu|Tricheur|rap|fr|4|2015|
Ninho|Goutte d'eau|rap|fr|3|2019|
PNL|Deux frères|rap|fr|3|2019|n
PNL|Le monde ou rien|rap|fr|4|2015|
Jul|On m'appelle l'ovni|rap|fr|5|2016|d
Gims|Ciel|rap|fr|3|2023|
Hamza|Fade Up|rap|fr|4|2019|
Laylow|Megatron|rap|fr|4|2020|
Lomepal|Yeux disent|rap|fr|3|2018|r
Lomepal|Mômes|rap|fr|3|2022|n
Soprano|Le Diable ne s'habille plus en Prada|rap|fr|4|2014|
Rohff|Qui est l'exemple ?|hiphop|fr|4|2001|
Lunatic|Le crime paie|hiphop|fr|3|2000|
Ärsenik|Boxe avec les mots|hiphop|fr|4|1998|
Assassin|Shoota Babylone|hiphop|fr|4|1993|
Grand Corps Malade|Saint-Denis|hiphop|fr|2|2006|n
Médine|Grand Paris|hiphop|fr|4|2017|
Youssoupha|Dreamin'|hiphop|fr|3|2012|
Ziak|Fixette|rap|fr|4|2021|
Koba LaD|Matrixé|rap|fr|4|2018|
Gambi|Popopop|rap|fr|5|2019|d
Vitalic|My Friend Dario|electro|techno|5|2005|
Breakbot|Baby I'm Yours|electro|house|4|2012|j
Gesaffelstein|Pursuit|electro|techno|4|2013|i
Rone|Bye Bye Macadam|electro|techno|3|2012|i
Worakls|Red Dressed|electro|techno|3|2016|i
N'to|Trauma|electro|techno|3|2014|i
Synapson|All in You|electro|house|4|2015|d
Møme|Aloha|electro|house|3|2016|j
Kungs|Never Going Home|electro|house|5|2022|d
Bob Sinclar|Rock This Party (Everybody Dance Now)|electro|dance|5|2006|d
Bob Marley & The Wailers|One Love / People Get Ready|reggae|roots|3|1977|j
Bob Marley & The Wailers|Exodus|reggae|roots|4|1977|
Bob Marley & The Wailers|Natural Mystic|reggae|roots|2|1977|
Bob Marley & The Wailers|I Shot the Sheriff|reggae|roots|3|1973|
Bob Marley & The Wailers|Iron Lion Zion|reggae|roots|4|1992|
Bob Marley & The Wailers|Satisfy My Soul|reggae|roots|3|1978|r
Bob Marley & The Wailers|Lively Up Yourself|reggae|roots|4|1974|d
Bob Marley & The Wailers|Kaya|reggae|roots|2|1978|
Bob Marley & The Wailers|Concrete Jungle|reggae|roots|3|1973|
Johnny Nash|I Can See Clearly Now|reggae|roots|3|1972|j
Ken Boothe|Everything I Own|reggae|roots|2|1974|r
Althea & Donna|Uptown Top Ranking|reggae|roots|3|1977|
Junior Murvin|Police and Thieves|reggae|roots|3|1976|
The Abyssinians|Satta Massagana|reggae|roots|2|1976|
Israel Vibration|Same Song|reggae|roots|3|1978|
Lee "Scratch" Perry|Roast Fish & Cornbread|reggae|roots|3|1978|
Aswad|Don't Turn Around|reggae|roots|3|1988|
Maxi Priest|Close to You|reggae|roots|3|1990|r
Musical Youth|Pass the Dutchie|reggae|roots|4|1982|j
Eddy Grant|Electric Avenue|reggae|roots|4|1982|d
Eddy Grant|Gimme Hope Jo'anna|reggae|roots|4|1988|
Matisyahu|King Without a Crown|reggae|roots|4|2005|
Rebelution|Feeling Alright|reggae|roots|3|2007|j
SOJA|Rest of My Life|reggae|roots|3|2012|
Iration|Time Bomb|reggae|roots|3|2010|
Damian Marley|Affairs of the Heart|reggae|roots|3|2017|r
Collie Buddz|Come Around|reggae|dancehall|4|2006|
Mr. Vegas|Heads High|reggae|dancehall|5|1998|d
Elephant Man|Pon de River, Pon de Bank|reggae|dancehall|5|2003|d
Sean Paul|No Lie|reggae|dancehall|4|2016|d
Busy Signal|Night Shift|reggae|dancehall|4|2008|
Konshens|Bruk Off Yuh Back|reggae|dancehall|5|2016|d
Charly Black|Gyal You a Party Animal|reggae|dancehall|5|2014|d
Shenseea|Blessed|reggae|dancehall|4|2019|
Alpha Blondy|Cocody Rock|reggae|fr|5|1984|d
Alpha Blondy|Wish You Were Here|reggae|fr|2|1997|
Tiken Jah Fakoly|Françafrique|reggae|fr|4|2002|
Tonton David|Peuples du monde|reggae|fr|4|1990|
Nuttea|Elle te rend dingue|reggae|fr|4|1997|d
Taïro|Bonne nouvelle|reggae|fr|3|2010|j
Celia Cruz|Guantanamera|latino|tropical|3|1968|
Tito Puente|Oye Como Va|latino|tropical|4|1963|d
Ibrahim Ferrer|Bruca Maniguá|latino|tropical|3|1999|
Omara Portuondo|Veinte Años|latino|tropical|1|1997|m
Oscar D'León|Llorarás|latino|tropical|4|1975|
Rubén Blades|Pedro Navaja|latino|tropical|4|1978|
Gilberto Santa Rosa|Conciencia|latino|tropical|4|1996|
Grupo Frontera|un x100to|latino|pop|3|2023|m
Peso Pluma|Ella Baila Sola|latino|pop|4|2023|d
Natalia Lafourcade|Hasta la Raíz|latino|pop|2|2015|r
Café Tacvba|Eres|latino|pop|2|2003|r
Soda Stereo|De Música Ligera|latino|pop|4|1990|
Maná|Rayando el Sol|latino|pop|3|1990|
Maná|Labios Compartidos|latino|pop|2|2006|r
Alejandro Sanz|Corazón Partío|latino|pop|4|1997|
Jesse & Joy|Corre!|latino|pop|2|2011|m
Sebastián Yatra|Traicionera|latino|pop|4|2016|d
Becky G|Mayores|latino|reggaeton|4|2017|d
Bad Bunny|DtMF|latino|reggaeton|3|2025|n
Bad Bunny|Monaco|latino|reggaeton|3|2023|
Wisin & Yandel|Rakata|latino|reggaeton|5|2005|d
Tego Calderón|Pa' Que Retozen|latino|reggaeton|5|2002|d
Sech|Otro Trago|latino|reggaeton|4|2019|d
Myke Towers|Lala|latino|reggaeton|4|2023|d
Young Miko|Classy 101|latino|reggaeton|4|2023|
Rosalía|Bizcochito|latino|reggaeton|4|2022|
C. Tangana|Tú Me Dejaste de Querer|latino|flamenco|4|2020|
Niña Pastori|Cai|latino|flamenco|3|1999|
Diego El Cigala|Lágrimas Negras|latino|flamenco|2|2003|m
Nujabes|The Final View|lofi|lofi|2|2003|i
Nujabes|Counting Stars|lofi|lofi|2|2005|i
Joji|Slow Dancing in the Dark|lofi|downtempo|2|2018|m
Joji|Glimpse of Us|lofi|downtempo|1|2022|m
Khruangbin|Time (You and I)|lofi|downtempo|3|2020|
Men I Trust|Show Me How|lofi|downtempo|2|2018|r
Men I Trust|Lauren|lofi|downtempo|2|2018|
Mac DeMarco|My Kind of Woman|lofi|downtempo|2|2012|r
Bonobo|Linked|lofi|chillelectro|4|2019|i
Lane 8|Brightest Lights|lofi|chillelectro|3|2020|
Yaeji|Raingurl|lofi|chillelectro|4|2017|
Tom Misch|Disco Yes|lofi|downtempo|4|2016|d
Tom Misch|It Runs Through Me|lofi|downtempo|3|2018|
FKJ|Tadow|lofi|downtempo|2|2017|i
Moderat|Bad Kingdom|lofi|chillelectro|3|2013|
Jamie xx|Gosh|lofi|chillelectro|4|2015|i
The xx|Intro|lofi|downtempo|2|2009|i
The xx|Crystalised|lofi|downtempo|2|2009|m
Nicolas Jaar|Mi Mujer|lofi|chillelectro|3|2010|
Caribou|Can't Do Without You|lofi|chillelectro|4|2014|
Sault|Wildfires|lofi|downtempo|2|2020|m
Big Bang|Bang Bang Bang|asie|kpop|5|2015|d
Girls' Generation|Gee|asie|kpop|5|2009|j
2NE1|I Am the Best|asie|kpop|5|2011|
SHINee|Ring Ding Dong|asie|kpop|5|2009|d
TXT|Sugar Rush Ride|asie|kpop|4|2023|d
ENHYPEN|Bite Me|asie|kpop|4|2023|
ILLIT|Magnetic|asie|kpop|4|2024|d
BABYMONSTER|SHEESH|asie|kpop|5|2024|
KISS OF LIFE|Sticky|asie|kpop|4|2024|d
Taeyeon|INVU|asie|kpop|3|2022|
Stray Kids|Chk Chk Boom|asie|kpop|5|2024|
ATEEZ|BOUNCY (K-HOT CHILLI PEPPERS)|asie|kpop|5|2023|
Taeyang|Eyes, Nose, Lips|asie|kpop|2|2014|m
Akdong Musician|Love Lee|asie|kpop|3|2023|j
Hikaru Utada|Hikari|asie|jpop|3|2002|
Kana-Boon|Silhouette|asie|anime|5|2014|
Asian Kung-Fu Generation|Haruka Kanata|asie|anime|5|2003|
Yuki Kajiura|Swordland|asie|anime|5|2012|i
Hiroyuki Sawano|Vogel im Käfig|asie|anime|4|2013|
Aimyon|Marigold|asie|jpop|3|2018|n
back number|Christmas Song|asie|jpop|2|2015|r
Spitz|Robinson|asie|jpop|3|1995|n
Perfume|Polyrhythm|asie|jpop|5|2007|d
Kyary Pamyu Pamyu|PonPonPon|asie|jpop|5|2011|j
Number Girl|Omoide in My Head|asie|jpop|5|1999|
Masayoshi Takanaka|Ready to Fly|asie|citypop|4|1980|i
Casiopea|Asayake|asie|citypop|4|1979|i
Hiroshi Sato|Say Goodbye|asie|citypop|3|1982|
Sezen Aksu|Firuze|monde|orient|3|1982|
Hindi Zahra|Beautiful Tango|monde|orient|2|2009|r
Cheb Khaled|Abdel Kader|monde|orient|5|1998|d
Idir|A Vava Inouva|monde|orient|1|1973|n
Anouar Brahem|Le Pas du chat noir|monde|orient|1|2002|i
Mashrou' Leila|Shim El Yasmine|monde|orient|2|2009|r
Omar Souleyman|Warni Warni|monde|orient|5|2013|d
Elyanna|Ganeni|monde|orient|4|2022|
Saint Levant|From Gaza, with Love|monde|orient|3|2023|
Ofra Haza|Im Nin'alu|monde|orient|4|1988|
Cesária Évora|Sodade|monde|afro|1|1992|n
Cesária Évora|Petit pays|monde|afro|2|1995|n
Mayra Andrade|Afeto|monde|afro|3|2019|r
Lura|Na Ri Na|monde|afro|4|2006|d
Ismaël Lô|Tajabone|monde|afro|1|1994|
Femi Kuti|Beng Beng Beng|monde|afro|5|1998|d
Sona Jobarteh|Gambia|monde|afro|3|2015|
Toumani Diabaté|Jarabi|monde|afro|1|1988|i
Ayra Starr|Rush|monde|afro|4|2022|
Fireboy DML|Peru|monde|afro|4|2021|d
Black Coffee|Drive|monde|afro|4|2018|
Uncle Waffles|Tanzania|monde|afro|4|2022|d
Seu Jorge|Life on Mars?|monde|bresil|1|2004|m
Novos Baianos|Preta Pretinha|monde|bresil|3|1972|
Djavan|Flor de Lis|monde|bresil|3|1976|r
Chico Buarque|Construção|monde|bresil|3|1971|
Milton Nascimento|Cais|monde|bresil|1|1972|m
Ivete Sangalo|Sorte Grande|monde|bresil|5|2003|d
Anavitória|Trevo (Tu)|monde|bresil|2|2016|r
Sidhu Moose Wala|295|monde|inde|4|2021|
AP Dhillon|Brown Munde|monde|inde|4|2020|d
Shankar-Ehsaan-Loy|Kajra Re|monde|inde|5|2005|d
Lata Mangeshkar|Lag Jaa Gale|monde|inde|1|1964|r
Kishore Kumar|Mere Sapno Ki Rani|monde|inde|3|1969|r
Charlie Parker|Ornithology|jazz|moderne|4|1946|i
Dizzy Gillespie|A Night in Tunisia|jazz|moderne|4|1946|i
Sonny Rollins|St. Thomas|jazz|moderne|4|1956|i
Oscar Peterson|C Jam Blues|jazz|swing|4|1962|i
Erroll Garner|Misty|jazz|cool|1|1954|i
Vince Guaraldi Trio|Linus and Lucy|jazz|cool|4|1964|i
Vince Guaraldi Trio|Cast Your Fate to the Wind|jazz|cool|2|1962|i
Ahmad Jamal|Poinciana|jazz|cool|2|1958|i
Paul Desmond|Take Ten|jazz|cool|2|1963|i
Antônio Carlos Jobim|Wave|jazz|cool|2|1967|i
Nina Simone|Sinnerman|jazz|vocal|4|1965|
Nina Simone|I Put a Spell on You|jazz|vocal|2|1965|
Etta James|Sunday Kind of Love|jazz|vocal|1|1960|r
Peggy Lee|Fever|jazz|vocal|2|1958|
Bobby Darin|Beyond the Sea|jazz|swing|4|1959|j
Tony Bennett|The Way You Look Tonight|jazz|vocal|2|1964|r
Louis Prima|Sing, Sing, Sing|jazz|swing|5|1936|d
Louis Prima|Just a Gigolo / I Ain't Got Nobody|jazz|swing|5|1956|j
Caro Emerald|A Night Like This|jazz|swing|4|2009|d
Parov Stelar|Booty Swing|jazz|swing|5|2011|d
Caravan Palace|Lone Digger|jazz|swing|5|2015|d
Caravan Palace|Jolie Coquine|jazz|swing|5|2008|d
Postmodern Jukebox|Seven Nation Army|jazz|swing|3|2015|
Jacob Collier|With the Love in My Heart|jazz|moderne|4|2018|
Robert Glasper|Afro Blue|jazz|moderne|2|2012|
Thundercat|Them Changes|jazz|moderne|3|2017|
BADBADNOTGOOD|Time Moves Slow|jazz|moderne|2|2016|m
Tigran Hamasyan|Leninagone|jazz|moderne|3|2015|i
Hiromi|Spiral|jazz|moderne|4|2006|i
Ezra Collective|Victory Dance|jazz|moderne|5|2022|d
Nubya Garcia|Pace|jazz|moderne|4|2020|i
# --- Hip-hop (2.2) ---
IAM|L'école du micro d'argent|hiphop|fr|4|1997|
IAM|Nés sous la même étoile|hiphop|fr|3|1997|m
Suprême NTM|Laisse pas traîner ton fils|hiphop|fr|4|1998|
Suprême NTM|Qu'est-ce qu'on attend|hiphop|fr|5|1995|
Suprême NTM|Pose ton gun|hiphop|fr|4|1998|
MC Solaar|Victime de la mode|hiphop|fr|3|1991|j
MC Solaar|La Belle et le Bad Boy|hiphop|fr|3|2001|r
MC Solaar|Qui sème le vent récolte le tempo|hiphop|fr|3|1991|
Oxmo Puccino|L'enfant seul|hiphop|fr|2|1998|m
Akhenaton|Bad Boys de Marseille|hiphop|fr|4|1995|
Shurik'n|Samouraï|hiphop|fr|4|1998|
113|Les Princes de la ville|hiphop|fr|4|1999|
Doc Gynéco|Né ici|hiphop|fr|3|1996|
Doc Gynéco|Nirvana|hiphop|fr|2|1996|m
Passi|Je zappe et je mate|hiphop|fr|4|1997|
Disiz La Peste|J'pète les plombs|hiphop|fr|4|2000|
Fonky Family|Mystère et suspense|hiphop|fr|4|1997|
Ministère A.M.E.R.|Sacrifice de poulet|hiphop|fr|4|1995|
Ärsenik|Affaires de famille|hiphop|fr|4|1998|
Kery James|Banlieusards|hiphop|fr|4|2008|
Psy 4 de la Rime|Le Son des Bandits|hiphop|fr|4|2002|
Saïan Supa Crew|X Raisons|hiphop|fr|4|2001|j
Grandmaster Flash and the Furious Five|The Message|hiphop|us|3|1982|
The Sugarhill Gang|Rapper's Delight|hiphop|us|4|1979|dj
Public Enemy|Fight the Power|hiphop|us|5|1989|
N.W.A|Straight Outta Compton|hiphop|us|5|1988|
Eric B. & Rakim|Paid in Full|hiphop|us|4|1987|
LL Cool J|Mama Said Knock You Out|hiphop|us|5|1990|
Naughty by Nature|Hip Hop Hooray|hiphop|us|4|1993|d
Digable Planets|Rebirth of Slick (Cool Like Dat)|hiphop|us|3|1993|
The Pharcyde|Passin' Me By|hiphop|us|3|1992|m
Mobb Deep|Shook Ones, Pt. II|hiphop|us|4|1995|
DMX|Party Up (Up in Here)|hiphop|us|5|1999|
The Roots|The Seed (2.0)|hiphop|us|4|2002|
Black Star|Definition|hiphop|us|4|1998|
Nas|If I Ruled the World (Imagine That)|hiphop|us|3|1996|
Wu-Tang Clan|Protect Ya Neck|hiphop|us|5|1993|
Dr. Dre|Nuthin' but a 'G' Thang|hiphop|us|3|1992|d
Busta Rhymes|Woo Hah!! Got You All in Check|hiphop|us|5|1996|
Jurassic 5|Concrete Schoolyard|hiphop|us|4|1997|j
Pete Rock & C.L. Smooth|They Reminisce Over You (T.R.O.Y.)|hiphop|us|3|1992|n
Arrested Development|Tennessee|hiphop|us|3|1992|
Souls of Mischief|93 'til Infinity|hiphop|us|3|1993|n
The Notorious B.I.G.|Big Poppa|hiphop|us|3|1994|d
# 2.7 : punk, grunge, prog, drum & bass, trance, ambient, synth-pop, indie pop, manouche, chants de marins, zouk, yé-yé, années 50 et avant
Ramones|Blitzkrieg Bop|rock|punk|4|1976|d
Ramones|I Wanna Be Sedated|rock|punk|4|1978|j
Sex Pistols|Anarchy in the U.K.|rock|punk|5|1976|
The Clash|London Calling|rock|punk|4|1979|
The Clash|Should I Stay or Should I Go|rock|punk|4|1982|d
Buzzcocks|Ever Fallen in Love (With Someone You Shouldn't've)|rock|punk|4|1978|r
The Undertones|Teenage Kicks|rock|punk|4|1978|j
Bad Religion|21st Century (Digital Boy)|rock|punk|4|1990|
Bérurier Noir|Porcherie|rock|punk|5|1985|
Stone Temple Pilots|Plush|rock|grunge|3|1992|m
The Smashing Pumpkins|1979|rock|grunge|3|1996|n
Yes|Roundabout|rock|prog|4|1971|
King Crimson|21st Century Schizoid Man|rock|prog|5|1969|
Rush|Tom Sawyer|rock|prog|4|1981|
Jethro Tull|Aqualung|rock|prog|4|1971|
Genesis|I Know What I Like (In Your Wardrobe)|rock|prog|3|1973|j
Emerson, Lake & Palmer|Lucky Man|rock|prog|2|1970|m
Jefferson Airplane|White Rabbit|rock|prog|3|1967|
Porcupine Tree|Trains|rock|prog|3|2002|m
Pendulum|Watercolour|electro|dnb|5|2010|
Pendulum|Tarantula|electro|dnb|5|2006|
Chase & Status|Blind Faith|electro|dnb|4|2011|j
Rudimental|Feel the Love|electro|dnb|4|2012|jd
Goldie|Inner City Life|electro|dnb|3|1995|
Roni Size|Brown Paper Bag|electro|dnb|4|1997|d
Netsky|Come Alive|electro|dnb|4|2012|j
Sub Focus|Tidal Wave|electro|dnb|4|2013|
Wilkinson|Afterglow|electro|dnb|4|2013|j
LTJ Bukem|Horizons|electro|dnb|3|1995|i
Shy FX|Original Nuttah|electro|dnb|5|1994|d
Paul van Dyk|For an Angel|electro|trance|4|1994|i
Energy 52|Café del Mar|electro|trance|4|1993|i
Binary Finary|1998|electro|trance|4|1998|i
Chicane|Saltwater|electro|trance|3|1999|
System F|Out of the Blue|electro|trance|5|1999|i
Brian Eno|An Ending (Ascent)|electro|ambient|1|1983|i
Brian Eno|1/1|electro|ambient|1|1978|i
Aphex Twin|Avril 14th|electro|ambient|1|2001|i
Vangelis|Blade Runner Blues|electro|ambient|1|1994|i
The Orb|Little Fluffy Clouds|electro|ambient|3|1990|
The Human League|Don't You Want Me|pop|synth|4|1981|d
New Order|Blue Monday|pop|synth|4|1983|d
Soft Cell|Tainted Love|pop|synth|4|1981|d
Orchestral Manoeuvres in the Dark|Enola Gay|pop|synth|4|1980|d
Yazoo|Only You|pop|synth|2|1982|r
CHVRCHES|The Mother We Share|pop|synth|4|2012|
Feist|1234|pop|indie|3|2007|j
The Shins|New Slang|pop|indie|2|2001|m
Django Reinhardt|Belleville|jazz|manouche|3|1942|i
Django Reinhardt|Daphné|jazz|manouche|3|1937|i
The Rosenberg Trio|Bossa Dorado|jazz|manouche|3|1993|i
Biréli Lagrène|Made in France|jazz|manouche|4|2001|i
Kassav'|Zouk-la sé sèl médikaman nou ni|monde|zouk|4|1984|dj
Kassav'|Syé bwa|monde|zouk|4|1987|d
Jocelyne Béroard|Kolé séré|monde|zouk|2|1986|r
Zouk Machine|Maldon|monde|zouk|4|1989|dj
Francky Vincent|Fruit de la passion|monde|zouk|4|1990|dj
Slaï|Flamme|monde|zouk|2|2004|r
Little Richard|Tutti Frutti|rock|classic|5|1955|dj
Brian Eno|Music for Airports 2/1|electro|ambient|1|1978|i
# 2.7 : punk, grunge, prog, drum & bass, trance, ambient, synth-pop, indie pop, manouche, chants de marins, zouk, yé-yé, années 50 et avant
Grouplove|Tongue Tied|pop|indie|4|2011|j
Peter Bjorn and John|Young Folks|pop|indie|3|2006|j
Cults|Go Outside|pop|indie|3|2010|j
Alvvays|Archie, Marry Me|pop|indie|3|2014|r
Beach House|Space Song|pop|indie|2|2015|m
The Postal Service|Such Great Heights|pop|indie|3|2003|r
Belle and Sebastian|The Boy with the Arab Strap|pop|indie|3|1998|j
girl in red|we fell in love in october|pop|indie|2|2018|r
Clairo|Sofia|pop|indie|3|2019|r
Harold Budd|The Pearl|electro|ambient|1|1984|i
Stars of the Lid|Requiem for Dying Mothers, Part 1|electro|ambient|1|1997|i
# 2.8 : catalogue enrichi (au moins 60 titres par sous-style)
Rainbow|Since You Been Gone|rock|hard|4|1979|
Alice Cooper|School's Out|rock|hard|5|1972|
Ted Nugent|Stranglehold|rock|hard|4|1975|
Poison|Nothin' but a Good Time|rock|hard|5|1988|j
Billy Idol|Rebel Yell|rock|hard|5|1983|
The Darkness|I Believe in a Thing Called Love|rock|hard|5|2003|j
Airbourne|Runnin' Wild|rock|hard|5|2007|
Molly Hatchet|Beatin' the Odds|rock|sudiste|4|1980|
Molly Hatchet|Dreams I'll Never See|rock|sudiste|4|1978|m
The Marshall Tucker Band|Heard It in a Love Song|rock|sudiste|3|1977|j
The Marshall Tucker Band|Fire on the Mountain|rock|sudiste|3|1975|
The Marshall Tucker Band|Take the Highway|rock|sudiste|4|1973|
The Charlie Daniels Band|The South's Gonna Do It|rock|sudiste|4|1975|j
The Charlie Daniels Band|Long Haired Country Boy|rock|sudiste|3|1975|
38 Special|Rockin' into the Night|rock|sudiste|4|1980|
38 Special|Second Chance|rock|sudiste|2|1988|r
The Black Crowes|Jealous Again|rock|sudiste|4|1990|
The Black Crowes|Remedy|rock|sudiste|4|1992|d
Outlaws|There Goes Another Love Song|rock|sudiste|4|1975|j
Outlaws|Hurry Sundown|rock|sudiste|4|1977|
Outlaws|Ghost Riders in the Sky|rock|sudiste|4|1980|
Blackfoot|Train, Train|rock|sudiste|5|1979|
Blackfoot|Fly Away|rock|sudiste|4|1981|
Blackberry Smoke|Ain't Much Left of Me|rock|sudiste|4|2012|
Blackberry Smoke|Sleeping Dogs|rock|sudiste|4|2012|
Blackberry Smoke|Waiting for the Thunder|rock|sudiste|4|2015|
Whiskey Myers|Broken Window Serenade|rock|sudiste|2|2011|m
Gov't Mule|Mule|rock|sudiste|4|1995|
Gov't Mule|Thorazine Shuffle|rock|sudiste|4|1998|
Drive-By Truckers|Women Without Whiskey|rock|sudiste|3|2001|m
Drive-By Truckers|Zip City|rock|sudiste|4|2001|
Wet Willie|Keep On Smilin'|rock|sudiste|3|1974|j
Elvin Bishop|Fooled Around and Fell in Love|rock|sudiste|2|1975|r
Atlanta Rhythm Section|So Into You|rock|sudiste|2|1976|r
Atlanta Rhythm Section|Imaginary Lover|rock|sudiste|2|1978|
Gregg Allman|I'm No Angel|rock|sudiste|3|1987|
Tedeschi Trucks Band|Midnight in Harlem|rock|sudiste|2|2011|m
Tedeschi Trucks Band|Bound for Glory|rock|sudiste|3|2011|
Rossington Collins Band|Don't Misunderstand Me|rock|sudiste|4|1980|
The Georgia Satellites|Keep Your Hands to Yourself|rock|sudiste|5|1986|j
The Georgia Satellites|Battleship Chains|rock|sudiste|4|1986|
Black Stone Cherry|Lonely Train|rock|sudiste|5|2006|
Black Stone Cherry|Blind Man|rock|sudiste|4|2008|
Black Stone Cherry|White Trash Millionaire|rock|sudiste|5|2011|
Little Feat|Dixie Chicken|rock|sudiste|3|1973|
Little Feat|Fat Man in the Bathtub|rock|sudiste|3|1973|
J.J. Cale|Call Me the Breeze|rock|sudiste|2|1972|
J.J. Cale|Cocaine|rock|sudiste|2|1976|
Tony Joe White|Polk Salad Annie|rock|sudiste|3|1968|
The Band|The Night They Drove Old Dixie Down|rock|sudiste|2|1969|m
ZZ Top|Cheap Sunglasses|rock|sudiste|4|1979|
Black Oak Arkansas|Jim Dandy|rock|sudiste|5|1973|j
Ramones|Sheena Is a Punk Rocker|rock|punk|4|1977|j
Ramones|Rockaway Beach|rock|punk|4|1977|j
Sex Pistols|God Save the Queen|rock|punk|5|1977|
Sex Pistols|Pretty Vacant|rock|punk|5|1977|
Sex Pistols|Holidays in the Sun|rock|punk|5|1977|
The Clash|Rock the Casbah|rock|punk|4|1982|d
The Clash|I Fought the Law|rock|punk|4|1979|
Buzzcocks|What Do I Get?|rock|punk|4|1978|
The Damned|New Rose|rock|punk|5|1976|
The Damned|Neat Neat Neat|rock|punk|5|1977|
The Stooges|I Wanna Be Your Dog|rock|punk|4|1969|
Dead Kennedys|California Über Alles|rock|punk|5|1979|
Dead Kennedys|Holiday in Cambodia|rock|punk|5|1980|
Black Flag|Rise Above|rock|punk|5|1981|
Black Flag|TV Party|rock|punk|4|1981|j
Minor Threat|Straight Edge|rock|punk|5|1981|
Descendents|Hope|rock|punk|5|1982|
Bad Religion|American Jesus|rock|punk|5|1993|
Bad Religion|Punk Rock Song|rock|punk|5|1996|
Bad Religion|Sorrow|rock|punk|4|2001|m
NOFX|Linoleum|rock|punk|5|1994|
NOFX|Bob|rock|punk|5|1992|
Rancid|Salvation|rock|punk|4|1994|
Rancid|Time Bomb|rock|punk|4|1995|d
Rancid|Ruby Soho|rock|punk|5|1995|
The Offspring|Come Out and Play|rock|punk|5|1994|
The Offspring|Gone Away|rock|punk|4|1997|m
The Offspring|Pretty Fly (for a White Guy)|rock|punk|5|1998|j
Green Day|Longview|rock|punk|4|1994|
Green Day|When I Come Around|rock|punk|3|1994|
Green Day|Minority|rock|punk|5|2000|j
Blink-182|Dammit|rock|punk|5|1997|
Blink-182|What's My Age Again?|rock|punk|5|1999|j
Blink-182|First Date|rock|punk|5|2001|j
Sum 41|Fat Lip|rock|punk|5|2001|
Sum 41|In Too Deep|rock|punk|5|2001|j
Sum 41|Still Waiting|rock|punk|5|2002|
Sum 41|Pieces|rock|punk|3|2004|m
Good Charlotte|Lifestyles of the Rich & Famous|rock|punk|5|2002|
Simple Plan|I'm Just a Kid|rock|punk|4|2002|
Simple Plan|Welcome to My Life|rock|punk|3|2004|m
New Found Glory|My Friends Over You|rock|punk|5|2002|
Jimmy Eat World|The Middle|rock|punk|4|2001|j
Jimmy Eat World|Sweetness|rock|punk|4|2001|
Millencolin|No Cigar|rock|punk|5|2000|
Pennywise|Bro Hymn|rock|punk|5|1991|
Rise Against|Swing Life Away|rock|punk|2|2004|m
Rise Against|Prayer of the Refugee|rock|punk|5|2006|
Rise Against|Savior|rock|punk|5|2008|
Against Me!|Thrash Unreal|rock|punk|4|2007|
Billy Talent|Try Honesty|rock|punk|4|2003|
Billy Talent|Red Flag|rock|punk|5|2006|
Billy Talent|Fallen Leaves|rock|punk|4|2006|m
X|Los Angeles|rock|punk|4|1980|
The Jam|In the City|rock|punk|5|1977|
The Jam|Going Underground|rock|punk|4|1980|
Stiff Little Fingers|Alternative Ulster|rock|punk|5|1978|
The Stranglers|No More Heroes|rock|punk|4|1977|
Television|Marquee Moon|rock|punk|3|1977|
Richard Hell & The Voidoids|Blank Generation|rock|punk|4|1977|
The Ruts|Babylon's Burning|rock|punk|5|1979|
Social Distortion|Ball and Chain|rock|punk|3|1990|m
Social Distortion|Story of My Life|rock|punk|4|1990|n
IDLES|Danny Nedelko|rock|punk|5|2018|j
IDLES|Never Fight a Man with a Perm|rock|punk|5|2018|
The Interrupters|She's Kerosene|rock|punk|5|2018|d
Alkaline Trio|Stupid Kid|rock|punk|4|2002|
My Chemical Romance|I'm Not Okay (I Promise)|rock|punk|5|2004|
My Chemical Romance|Helena|rock|punk|5|2004|m
My Chemical Romance|Welcome to the Black Parade|rock|punk|5|2006|
Bérurier Noir|Salut à toi|rock|punk|5|1985|
Bad Brains|Banned in D.C.|rock|punk|5|1982|
Operation Ivy|Sound System|rock|punk|4|1989|d
Sham 69|If the Kids Are United|rock|punk|4|1978|
The Gaslight Anthem|The '59 Sound|rock|punk|4|2008|n
Nirvana|Lithium|rock|grunge|4|1991|
Nirvana|In Bloom|rock|grunge|4|1991|
Nirvana|All Apologies|rock|grunge|3|1993|m
Pearl Jam|Even Flow|rock|grunge|4|1991|
Pearl Jam|Jeremy|rock|grunge|3|1991|m
Soundgarden|Outshined|rock|grunge|4|1991|
Soundgarden|Spoonman|rock|grunge|4|1994|
Soundgarden|Fell on Black Days|rock|grunge|3|1994|m
Alice in Chains|Would?|rock|grunge|4|1992|
Alice in Chains|Rooster|rock|grunge|3|1992|m
Alice in Chains|Them Bones|rock|grunge|5|1992|
Stone Temple Pilots|Sex Type Thing|rock|grunge|5|1992|
Stone Temple Pilots|Interstate Love Song|rock|grunge|4|1994|
Stone Temple Pilots|Vasoline|rock|grunge|4|1994|
The Smashing Pumpkins|Today|rock|grunge|4|1993|n
The Smashing Pumpkins|Bullet with Butterfly Wings|rock|grunge|5|1995|
The Smashing Pumpkins|Tonight, Tonight|rock|grunge|3|1995|
Mudhoney|Touch Me I'm Sick|rock|grunge|5|1988|
Screaming Trees|Nearly Lost You|rock|grunge|4|1992|
Temple of the Dog|Hunger Strike|rock|grunge|3|1991|
Mad Season|River of Deceit|rock|grunge|2|1995|m
Silverchair|Tomorrow|rock|grunge|4|1994|
Silverchair|Freak|rock|grunge|5|1997|
Bush|Glycerine|rock|grunge|2|1994|m
Bush|Machinehead|rock|grunge|5|1994|
Bush|Comedown|rock|grunge|3|1994|
Hole|Celebrity Skin|rock|grunge|5|1998|
Hole|Malibu|rock|grunge|4|1998|
L7|Pretend We're Dead|rock|grunge|4|1992|
Candlebox|Far Behind|rock|grunge|3|1993|m
Live|Lightning Crashes|rock|grunge|3|1994|m
Live|I Alone|rock|grunge|4|1994|
Collective Soul|Shine|rock|grunge|4|1993|
Collective Soul|December|rock|grunge|3|1995|
Everclear|Santa Monica|rock|grunge|4|1995|
Weezer|Buddy Holly|rock|grunge|4|1994|j
Weezer|Say It Ain't So|rock|grunge|3|1994|
Weezer|Undone - The Sweater Song|rock|grunge|3|1994|
Beck|Loser|rock|grunge|3|1993|
Foo Fighters|This Is a Call|rock|grunge|4|1995|
Foo Fighters|Monkey Wrench|rock|grunge|5|1997|
Foo Fighters|My Hero|rock|grunge|4|1997|
Radiohead|Just|rock|grunge|4|1995|
Radiohead|Paranoid Android|rock|grunge|3|1997|m
Pixies|Debaser|rock|grunge|4|1989|
Pixies|Monkey Gone to Heaven|rock|grunge|4|1989|
Sonic Youth|Teen Age Riot|rock|grunge|4|1988|
Sonic Youth|Kool Thing|rock|grunge|4|1990|
Dinosaur Jr.|Feel the Pain|rock|grunge|4|1994|
Jane's Addiction|Jane Says|rock|grunge|2|1988|
Jane's Addiction|Been Caught Stealing|rock|grunge|4|1990|d
Faith No More|Epic|rock|grunge|5|1989|
Faith No More|Midlife Crisis|rock|grunge|4|1992|
Garbage|Stupid Girl|rock|grunge|4|1995|d
Garbage|Only Happy When It Rains|rock|grunge|4|1995|
Garbage|I Think I'm Paranoid|rock|grunge|5|1998|
Veruca Salt|Seether|rock|grunge|5|1994|
The Breeders|Cannonball|rock|grunge|4|1993|
Local H|Bound for the Floor|rock|grunge|4|1996|
Toadies|Possum Kingdom|rock|grunge|4|1994|
Filter|Hey Man Nice Shot|rock|grunge|4|1995|
Marcy Playground|Sex and Candy|rock|grunge|2|1997|
Semisonic|Closing Time|rock|grunge|3|1998|n
Fuel|Shimmer|rock|grunge|3|1998|
Fuel|Hemorrhage (In My Hands)|rock|grunge|3|2000|m
Creed|My Own Prison|rock|grunge|4|1997|
Creed|Higher|rock|grunge|4|1999|
Creed|With Arms Wide Open|rock|grunge|3|1999|r
Incubus|Pardon Me|rock|grunge|4|1999|
Incubus|Drive|rock|grunge|3|1999|
Our Lady Peace|Superman's Dead|rock|grunge|4|1997|
Seven Mary Three|Cumbersome|rock|grunge|3|1995|
Soul Asylum|Runaway Train|rock|grunge|2|1992|m
Nine Inch Nails|Closer|rock|grunge|4|1994|d
Nine Inch Nails|Hurt|rock|grunge|1|1994|m
Hum|Stars|rock|grunge|4|1995|
Helmet|Unsung|rock|grunge|5|1992|
Meat Puppets|Backwater|rock|grunge|4|1994|
Blind Melon|No Rain|rock|grunge|2|1992|j
The Verve Pipe|The Freshmen|rock|grunge|2|1996|m
Dishwalla|Counting Blue Cars|rock|grunge|3|1995|
Eve 6|Inside Out|rock|grunge|4|1998|
Harvey Danger|Flagpole Sitta|rock|grunge|5|1997|
Nada Surf|Popular|rock|grunge|4|1996|
Spacehog|In the Meantime|rock|grunge|4|1995|
Pink Floyd|Shine On You Crazy Diamond (Pts. 1-5)|rock|prog|2|1975|m
Yes|Long Distance Runaround|rock|prog|3|1971|
Yes|Close to the Edge|rock|prog|3|1972|
Yes|Owner of a Lonely Heart|rock|prog|4|1983|
King Crimson|Epitaph|rock|prog|2|1969|m
King Crimson|In the Court of the Crimson King|rock|prog|3|1969|m
King Crimson|Starless|rock|prog|3|1974|m
Rush|The Spirit of Radio|rock|prog|4|1980|
Rush|Limelight|rock|prog|4|1981|
Rush|YYZ|rock|prog|4|1981|i
Genesis|Supper's Ready|rock|prog|3|1972|
Genesis|Firth of Fifth|rock|prog|3|1973|
Genesis|The Carpet Crawlers|rock|prog|2|1974|
Jethro Tull|Living in the Past|rock|prog|3|1969|
Jethro Tull|Locomotive Breath|rock|prog|4|1971|
Emerson, Lake & Palmer|From the Beginning|rock|prog|2|1972|m
Emerson, Lake & Palmer|Fanfare for the Common Man|rock|prog|4|1977|i
Camel|Lady Fantasy|rock|prog|3|1974|
Marillion|Script for a Jester's Tear|rock|prog|3|1983|m
Marillion|Kayleigh|rock|prog|3|1985|rm
Marillion|Lavender|rock|prog|2|1985|r
Procol Harum|A Whiter Shade of Pale|rock|prog|2|1967|mn
The Moody Blues|Nights in White Satin|rock|prog|2|1967|rm
The Moody Blues|Tuesday Afternoon|rock|prog|2|1967|
The Moody Blues|Question|rock|prog|4|1970|
The Alan Parsons Project|I Wouldn't Want to Be Like You|rock|prog|3|1977|
The Alan Parsons Project|Sirius|rock|prog|3|1982|i
The Alan Parsons Project|Eye in the Sky|rock|prog|2|1982|m
Dream Theater|Pull Me Under|rock|prog|5|1992|
Dream Theater|The Spirit Carries On|rock|prog|3|1999|m
Porcupine Tree|Blackest Eyes|rock|prog|4|2002|
Porcupine Tree|Lazarus|rock|prog|2|2005|m
Porcupine Tree|Fear of a Blank Planet|rock|prog|4|2007|
Steven Wilson|The Raven That Refused to Sing|rock|prog|2|2013|m
Jefferson Airplane|Somebody to Love|rock|prog|4|1967|
The Doors|Break On Through (To the Other Side)|rock|prog|4|1967|
The Doors|The End|rock|prog|2|1967|m
The Beatles|Tomorrow Never Knows|rock|prog|3|1966|
The Beatles|Strawberry Fields Forever|rock|prog|3|1967|n
The Beatles|Lucy in the Sky with Diamonds|rock|prog|3|1967|
The Byrds|Eight Miles High|rock|prog|3|1966|
Iron Butterfly|In-A-Gadda-Da-Vida|rock|prog|4|1968|
The Zombies|Time of the Season|rock|prog|3|1968|
Love|Alone Again Or|rock|prog|3|1967|
The 13th Floor Elevators|You're Gonna Miss Me|rock|prog|4|1966|
Strawberry Alarm Clock|Incense and Peppermints|rock|prog|3|1967|
Steppenwolf|Magic Carpet Ride|rock|prog|4|1968|
Vanilla Fudge|You Keep Me Hangin' On|rock|prog|3|1967|
Traffic|Dear Mr. Fantasy|rock|prog|3|1967|
The Crazy World of Arthur Brown|Fire|rock|prog|4|1968|
The Electric Prunes|I Had Too Much to Dream (Last Night)|rock|prog|4|1966|
Donovan|Sunshine Superman|rock|prog|3|1966|j
Donovan|Season of the Witch|rock|prog|3|1966|
Hawkwind|Silver Machine|rock|prog|5|1972|
Can|Vitamin C|rock|prog|3|1972|
King Gizzard & the Lizard Wizard|Robot Stop|rock|prog|5|2016|
King Gizzard & the Lizard Wizard|Rattlesnake|rock|prog|5|2017|
Temples|Shelter Song|rock|prog|3|2012|
Tame Impala|Elephant|rock|prog|4|2012|
Tame Impala|Feels Like We Only Go Backwards|rock|prog|3|2012|n
The Flaming Lips|Race for the Prize|rock|prog|4|1999|
The Flaming Lips|Do You Realize??|rock|prog|3|2002|j
Mercury Rev|Goddess on a Hiway|rock|prog|3|1998|
The Mars Volta|Inertiatic ESP|rock|prog|5|2003|
The Mars Volta|The Widow|rock|prog|3|2005|m
Coheed and Cambria|A Favor House Atlantic|rock|prog|4|2003|
Coheed and Cambria|Welcome Home|rock|prog|5|2005|
Anathema|Untouchable, Part 1|rock|prog|3|2012|m
Renaissance|Northern Lights|rock|prog|3|1978|
Barclay James Harvest|Hymn|rock|prog|2|1977|
Focus|Hocus Pocus|rock|prog|5|1971|i
Kansas|Point of Know Return|rock|prog|4|1977|
The Velvet Underground|Venus in Furs|rock|prog|2|1967|
Frank Zappa|Peaches en Regalia|rock|prog|3|1969|i
Tears for Fears|Head Over Heels|poprock|8090|3|1985|r
INXS|New Sensation|poprock|8090|4|1987|d
Roxette|Joyride|poprock|8090|4|1991|j
Simple Minds|Alive and Kicking|poprock|8090|4|1985|
The Cure|Lovesong|poprock|8090|3|1989|r
R.E.M.|The One I Love|poprock|8090|4|1987|
R.E.M.|Shiny Happy People|poprock|8090|4|1991|j
The Cranberries|Ode to My Family|poprock|8090|3|1994|n
Alanis Morissette|You Oughta Know|poprock|8090|4|1995|
Sheryl Crow|If It Makes You Happy|poprock|8090|3|1996|
Sheryl Crow|Everyday Is a Winding Road|poprock|8090|3|1996|
Gin Blossoms|Follow You Down|poprock|8090|4|1996|j
Counting Crows|Round Here|poprock|8090|2|1993|m
Hootie & the Blowfish|Only Wanna Be with You|poprock|8090|4|1994|j
Hootie & the Blowfish|Let Her Cry|poprock|8090|2|1994|m
Spin Doctors|Two Princes|poprock|8090|4|1991|j
The Bangles|Walk Like an Egyptian|poprock|8090|4|1986|jd
The Go-Go's|We Got the Beat|poprock|8090|5|1981|jd
The Go-Go's|Our Lips Are Sealed|poprock|8090|4|1981|j
Blondie|Call Me|poprock|8090|4|1980|d
Blondie|The Tide Is High|poprock|8090|3|1980|j
The Pretenders|Back on the Chain Gang|poprock|8090|3|1982|
Pat Benatar|Love Is a Battlefield|poprock|8090|4|1983|
Rick Springfield|Jessie's Girl|poprock|8090|4|1981|j
Daryl Hall & John Oates|You Make My Dreams|poprock|8090|4|1980|jd
Daryl Hall & John Oates|Maneater|poprock|8090|4|1982|
Men at Work|Down Under|poprock|8090|4|1981|j
Men at Work|Who Can It Be Now?|poprock|8090|3|1981|
Huey Lewis and the News|Hip to Be Square|poprock|8090|4|1986|j
Dexys Midnight Runners|Come On Eileen|poprock|8090|5|1982|jd
Billy Idol|White Wedding|poprock|8090|4|1982|
The Proclaimers|I'm Gonna Be (500 Miles)|poprock|8090|5|1988|j
The Outfield|Your Love|poprock|8090|4|1985|
Corey Hart|Sunglasses at Night|poprock|8090|4|1983|
Mr. Mister|Broken Wings|poprock|8090|3|1985|
Bruce Hornsby and the Range|The Way It Is|poprock|8090|2|1986|m
Fleetwood Mac|Little Lies|poprock|8090|3|1987|
Steve Winwood|Higher Love|poprock|8090|4|1986|j
Del Amitri|Roll to Me|poprock|8090|4|1995|j
Smash Mouth|Walkin' on the Sun|poprock|8090|4|1997|
Smash Mouth|All Star|poprock|8090|4|1999|j
Sugar Ray|Fly|poprock|8090|3|1997|j
Sugar Ray|Every Morning|poprock|8090|3|1999|j
Fastball|The Way|poprock|8090|3|1998|
Barenaked Ladies|One Week|poprock|8090|5|1998|j
New Radicals|You Get What You Give|poprock|8090|4|1998|j
Edwin McCain|I'll Be|poprock|8090|2|1998|r
Vertical Horizon|Everything You Want|poprock|8090|3|1999|
The Wallflowers|One Headlight|poprock|8090|3|1996|
Meredith Brooks|Bitch|poprock|8090|4|1997|
Crash Test Dummies|Mmm Mmm Mmm Mmm|poprock|8090|2|1993|
Deep Blue Something|Breakfast at Tiffany's|poprock|8090|3|1995|n
Lit|My Own Worst Enemy|poprock|8090|5|1999|
Avril Lavigne|I'm with You|poprock|2000|2|2002|m
Avril Lavigne|My Happy Ending|poprock|2000|4|2004|m
Kelly Clarkson|Behind These Hazel Eyes|poprock|2000|4|2004|m
Kelly Clarkson|My Life Would Suck Without You|poprock|2000|5|2009|
Pink|Who Knew|poprock|2000|3|2006|m
Pink|Raise Your Glass|poprock|2000|5|2010|j
Paramore|Decode|poprock|2000|4|2008|
Paramore|The Only Exception|poprock|2000|2|2009|r
Maroon 5|Harder to Breathe|poprock|2000|4|2002|
The Fray|Over My Head (Cable Car)|poprock|2000|3|2005|
The Fray|You Found Me|poprock|2000|3|2008|m
Daughtry|It's Not Over|poprock|2000|4|2006|
Daughtry|Home|poprock|2000|3|2006|n
Lifehouse|Hanging by a Moment|poprock|2000|3|2000|r
Lifehouse|You and Me|poprock|2000|2|2005|r
Nickelback|How You Remind Me|poprock|2000|4|2001|m
Nickelback|Photograph|poprock|2000|3|2005|n
3 Doors Down|Kryptonite|poprock|2000|4|2000|
3 Doors Down|Here Without You|poprock|2000|2|2002|m
Switchfoot|Meant to Live|poprock|2000|4|2003|
The Calling|Wherever You Will Go|poprock|2000|3|2001|r
Hoobastank|The Reason|poprock|2000|3|2003|r
Michelle Branch|Everywhere|poprock|2000|4|2001|j
Keane|Everybody's Changing|poprock|2000|3|2004|
Snow Patrol|Open Your Eyes|poprock|2000|4|2006|
Plain White T's|Hey There Delilah|poprock|2000|1|2006|r
The All-American Rejects|Dirty Little Secret|poprock|2000|5|2005|
The All-American Rejects|Gives You Hell|poprock|2000|5|2008|j
Busted|Year 3000|poprock|2000|5|2002|j
Fall Out Boy|This Ain't a Scene, It's an Arms Race|poprock|2000|5|2007|
Fall Out Boy|Thnks fr th Mmrs|poprock|2000|5|2007|
Panic! at the Disco|I Write Sins Not Tragedies|poprock|2000|5|2005|
Twenty One Pilots|Ride|poprock|actuel|3|2015|
Olivia Rodrigo|bad idea right?|poprock|actuel|5|2023|
Fall Out Boy|Uma Thurman|poprock|actuel|4|2015|d
Panic! at the Disco|Hey Look Ma, I Made It|poprock|actuel|4|2018|j
Avril Lavigne|Bite Me|poprock|actuel|5|2021|
Hozier|Work Song|poprock|actuel|2|2014|r
Bastille|Good Grief|poprock|actuel|4|2016|
Royal Blood|Out of the Black|poprock|actuel|5|2014|
Royal Blood|Figure It Out|poprock|actuel|5|2014|
Greta Van Fleet|Highway Tune|poprock|actuel|5|2017|
Nothing But Thieves|Amsterdam|poprock|actuel|4|2017|
Sam Fender|Hypersonic Missiles|poprock|actuel|4|2019|
Wallows|Are You Bored Yet?|poprock|actuel|3|2019|
Cage the Elephant|Come a Little Closer|poprock|actuel|3|2013|
Fontaines D.C.|Favourite|poprock|actuel|4|2024|n
Benson Boone|In the Stars|poprock|actuel|2|2022|m
Noah Kahan|Dial Drunk|poprock|actuel|3|2022|
Noir Désir|Aux sombres héros de l'amer|poprock|fr|3|1989|n
Louise Attaque|Les nuits parisiennes|poprock|fr|4|1997|
Kyo|Dernière danse|poprock|fr|3|2003|m
Kyo|Je cours|poprock|fr|4|2003|
Mickey 3D|Tu vas pas mourir de rire|poprock|fr|3|2003|
Les Rita Mitsouko|Andy|poprock|fr|4|1986|d
Axel Bauer|Cargo de nuit|poprock|fr|4|1983|
Louis Bertignac|Ces idées-là|poprock|fr|3|1993|
Les Négresses Vertes|Zobi la mouche|poprock|fr|4|1988|j
Cali|C'est quand le bonheur ?|poprock|fr|4|2003|
Gérald de Palmas|Sur la route|poprock|fr|3|1994|
Gérald de Palmas|J'en rêve encore|poprock|fr|2|2000|r
Jacques Dutronc|Les cactus|poprock|fr|4|1967|j
Hubert-Félix Thiéfaine|La fille du coupeur de joints|poprock|fr|4|1978|
Niagara|L'amour à la plage|poprock|fr|4|1986|j
-M-|Le Complexe du corbeau|poprock|fr|3|1999|
-M-|Qui de nous deux|poprock|fr|3|2003|r
Eiffel|À tout moment la rue|poprock|fr|4|2009|
Stephan Eicher|Déjeuner en paix|poprock|fr|2|1991|
Judas Priest|Hell Bent for Leather|metal|heavy|5|1978|
Black Sabbath|N.I.B.|metal|heavy|4|1970|
Ozzy Osbourne|Bark at the Moon|metal|heavy|5|1983|
Dio|The Last in Line|metal|heavy|5|1984|
Motörhead|Overkill|metal|heavy|5|1979|
Motörhead|Killed by Death|metal|heavy|5|1984|
Megadeth|Peace Sells|metal|heavy|5|1986|
Megadeth|Hangar 18|metal|heavy|5|1990|
Slayer|Angel of Death|metal|heavy|5|1986|
Slayer|South of Heaven|metal|heavy|4|1988|
Anthrax|Caught in a Mosh|metal|heavy|5|1987|
Anthrax|Indians|metal|heavy|5|1987|
Testament|Practice What You Preach|metal|heavy|5|1989|
Helloween|Future World|metal|heavy|5|1987|j
Helloween|Eagle Fly Free|metal|heavy|5|1988|j
Blind Guardian|Valhalla|metal|heavy|5|1989|
Blind Guardian|The Bard's Song - In the Forest|metal|heavy|2|1992|n
Manowar|Hail and Kill|metal|heavy|5|1988|
Saxon|Wheels of Steel|metal|heavy|5|1980|
Accept|Fast as a Shark|metal|heavy|5|1982|
Queensrÿche|Eyes of a Stranger|metal|heavy|4|1988|
Queensrÿche|Silent Lucidity|metal|heavy|2|1990|m
Diamond Head|Am I Evil?|metal|heavy|5|1980|
Ratt|Round and Round|metal|heavy|4|1984|
HammerFall|Hearts on Fire|metal|heavy|5|2002|j
Stratovarius|Hunting High and Low|metal|heavy|5|2000|j
Sabaton|Ghost Division|metal|heavy|5|2008|
Sabaton|Swedish Pagans|metal|heavy|5|2008|j
Powerwolf|We Drink Your Blood|metal|heavy|5|2011|
Powerwolf|Army of the Night|metal|heavy|5|2015|
DragonForce|Through the Fire and Flames|metal|heavy|5|2006|
Korn|Blind|metal|moderne|5|1994|
Korn|Coming Undone|metal|moderne|4|2005|d
Deftones|Be Quiet and Drive (Far Away)|metal|moderne|4|1997|m
Disturbed|Stricken|metal|moderne|5|2005|
Papa Roach|Scars|metal|moderne|3|2004|m
Breaking Benjamin|So Cold|metal|moderne|4|2004|
Breaking Benjamin|The Diary of Jane|metal|moderne|5|2006|
Three Days Grace|I Hate Everything About You|metal|moderne|4|2003|
Three Days Grace|Animal I Have Become|metal|moderne|5|2006|
Three Days Grace|Never Too Late|metal|moderne|3|2007|m
Godsmack|Voodoo|metal|moderne|3|1998|
Godsmack|I Stand Alone|metal|moderne|5|2002|
Mudvayne|Dig|metal|moderne|5|2000|
Drowning Pool|Bodies|metal|moderne|5|2001|
Static-X|Push It|metal|moderne|5|1999|
P.O.D.|Youth of the Nation|metal|moderne|4|2001|m
P.O.D.|Alive|metal|moderne|4|2001|j
Chevelle|The Red|metal|moderne|4|2002|
Killswitch Engage|The End of Heartache|metal|moderne|4|2004|m
Killswitch Engage|My Curse|metal|moderne|5|2006|
Bullet for My Valentine|Tears Don't Fall|metal|moderne|5|2005|m
Bullet for My Valentine|Waking the Demon|metal|moderne|5|2008|
Parkway Drive|Wild Eyes|metal|moderne|5|2015|
Parkway Drive|Prey|metal|moderne|5|2018|
Avenged Sevenfold|Bat Country|metal|moderne|5|2005|
Avenged Sevenfold|Afterlife|metal|moderne|5|2007|
Trivium|Pull Harder on the Strings of Your Martyr|metal|moderne|5|2005|
Machine Head|Davidian|metal|moderne|5|1994|
Bring Me the Horizon|Throne|metal|moderne|5|2015|
Spiritbox|Holy Roller|metal|moderne|5|2020|
Spiritbox|Circle with Me|metal|moderne|4|2021|
Bad Omens|Just Pretend|metal|moderne|4|2022|m
Architects|Animals|metal|moderne|5|2020|
Gojira|Flying Whales|metal|moderne|5|2005|
Mastodon|Oblivion|metal|moderne|4|2009|
Ghost|Cirice|metal|moderne|4|2015|
Sleep Token|The Offering|metal|moderne|5|2023|
Epica|Sancta Terra|metal|symphonique|4|2005|
Epica|Storm the Sorrow|metal|symphonique|5|2012|
Therion|Birth of Venus Illegitima|metal|symphonique|4|1998|
Therion|Lemuria|metal|symphonique|3|2004|
Rhapsody of Fire|Land of Immortals|metal|symphonique|5|1997|
Rhapsody of Fire|Dawn of Victory|metal|symphonique|5|2000|
Rhapsody of Fire|Holy Thunderforce|metal|symphonique|5|2000|
Delain|Sleepwalkers Dream|metal|symphonique|4|2006|
Delain|Get the Devil Out of Me|metal|symphonique|4|2009|
Delain|We Are the Others|metal|symphonique|4|2012|
Sonata Arctica|Replica|metal|symphonique|4|1999|m
Sonata Arctica|San Sebastian|metal|symphonique|5|2001|
Sonata Arctica|Don't Say a Word|metal|symphonique|5|2004|
Kamelot|Forever|metal|symphonique|4|1998|
Kamelot|Center of the Universe|metal|symphonique|5|2003|
Kamelot|The Haunting (Somewhere in Time)|metal|symphonique|4|2005|r
Amaranthe|Hunger|metal|symphonique|5|2011|
Amaranthe|Amaranthine|metal|symphonique|3|2011|r
Amaranthe|Drop Dead Cynical|metal|symphonique|5|2014|
Beyond the Black|Songs of Love and Death|metal|symphonique|4|2015|
Beyond the Black|Lost in Forever|metal|symphonique|4|2016|
Tarja|I Walk Alone|metal|symphonique|4|2007|
Tarja|Die Alive|metal|symphonique|4|2007|
Tarja|Until My Last Breath|metal|symphonique|4|2010|
Tarja|Victim of Ritual|metal|symphonique|4|2013|
Lacuna Coil|Heaven's a Lie|metal|symphonique|4|2002|
Lacuna Coil|Our Truth|metal|symphonique|5|2006|
Dimmu Borgir|Mourning Palace|metal|symphonique|5|1997|
Dimmu Borgir|Progenies of the Great Apocalypse|metal|symphonique|5|2003|
Dimmu Borgir|Gateways|metal|symphonique|5|2010|
Avantasia|Lost in Space|metal|symphonique|3|2007|
Avantasia|The Scarecrow|metal|symphonique|4|2008|
Avantasia|Dying for an Angel|metal|symphonique|4|2010|
Cradle of Filth|Her Ghost in the Fog|metal|symphonique|5|2000|
Cradle of Filth|Nymphetamine (Fix)|metal|symphonique|4|2004|
Trans-Siberian Orchestra|Christmas Eve / Sarajevo 12/24|metal|symphonique|4|1996|i
Trans-Siberian Orchestra|Wizards in Winter|metal|symphonique|5|2004|i
Symphony X|Sea of Lies|metal|symphonique|5|1998|
Symphony X|Set the World on Fire (The Lie of Lies)|metal|symphonique|5|2007|
Angra|Carry On|metal|symphonique|5|1993|
Angra|Nova Era|metal|symphonique|5|2001|
Angra|Rebirth|metal|symphonique|4|2001|
Stratovarius|Forever|metal|symphonique|1|1996|m
Stratovarius|Black Diamond|metal|symphonique|5|1997|
Battle Beast|King for a Day|metal|symphonique|5|2015|
Bananarama|Venus|pop|8090|5|1986|d
Paula Abdul|Straight Up|pop|8090|4|1988|d
Janet Jackson|Rhythm Nation|pop|8090|5|1989|d
Richard Marx|Right Here Waiting|pop|8090|1|1989|r
Des'ree|You Gotta Be|pop|8090|3|1994|j
a-ha|The Sun Always Shines on T.V.|pop|synth|4|1985|
Eurythmics|Love Is a Stranger|pop|synth|3|1982|
Eurythmics|Here Comes the Rain Again|pop|synth|3|1983|m
Pet Shop Boys|Always on My Mind|pop|synth|4|1987|d
Pet Shop Boys|Opportunities (Let's Make Lots of Money)|pop|synth|4|1985|
Depeche Mode|Never Let Me Down Again|pop|synth|4|1987|
Depeche Mode|Everything Counts|pop|synth|4|1983|
Philip Oakey & Giorgio Moroder|Together in Electric Dreams|pop|synth|4|1984|r
The Human League|(Keep Feeling) Fascination|pop|synth|4|1983|j
The Human League|Mirror Man|pop|synth|4|1982|
New Order|Bizarre Love Triangle|pop|synth|4|1986|r
New Order|True Faith|pop|synth|4|1987|
New Order|Regret|pop|synth|4|1993|
Soft Cell|Say Hello, Wave Goodbye|pop|synth|2|1982|m
Orchestral Manoeuvres in the Dark|Electricity|pop|synth|4|1979|
Orchestral Manoeuvres in the Dark|Souvenir|pop|synth|2|1981|n
Orchestral Manoeuvres in the Dark|If You Leave|pop|synth|3|1986|r
Yazoo|Don't Go|pop|synth|5|1982|d
Yazoo|Situation|pop|synth|4|1982|d
Erasure|A Little Respect|pop|synth|4|1988|j
Erasure|Sometimes|pop|synth|4|1986|
Erasure|Oh L'amour|pop|synth|4|1987|r
Erasure|Always|pop|synth|3|1994|r
Bronski Beat|Smalltown Boy|pop|synth|4|1984|m
Alphaville|Forever Young|pop|synth|2|1984|mn
Alphaville|Big in Japan|pop|synth|4|1984|
Alphaville|Sounds Like a Melody|pop|synth|3|1984|
Gary Numan|Cars|pop|synth|4|1979|
Tubeway Army|Are 'Friends' Electric?|pop|synth|3|1979|
Visage|Fade to Grey|pop|synth|3|1980|
Ultravox|Vienna|pop|synth|2|1981|m
Japan|Ghosts|pop|synth|1|1981|m
Talk Talk|It's My Life|pop|synth|4|1984|
Talk Talk|Such a Shame|pop|synth|4|1984|
Duran Duran|Rio|pop|synth|5|1982|d
Duran Duran|Girls on Film|pop|synth|5|1981|d
Duran Duran|Save a Prayer|pop|synth|2|1982|r
Naked Eyes|Always Something There to Remind Me|pop|synth|4|1982|
A Flock of Seagulls|I Ran (So Far Away)|pop|synth|4|1982|
Thompson Twins|Hold Me Now|pop|synth|3|1983|r
Thompson Twins|Doctor! Doctor!|pop|synth|4|1984|
Howard Jones|Things Can Only Get Better|pop|synth|4|1985|j
Howard Jones|What Is Love?|pop|synth|3|1983|
Nik Kershaw|Wouldn't It Be Good|pop|synth|3|1984|
Kajagoogoo|Too Shy|pop|synth|4|1983|
Frankie Goes to Hollywood|Relax|pop|synth|5|1983|d
Frankie Goes to Hollywood|Two Tribes|pop|synth|5|1984|d
Dead or Alive|You Spin Me Round (Like a Record)|pop|synth|5|1984|d
Men Without Hats|The Safety Dance|pop|synth|4|1982|j
Modern English|I Melt with You|pop|synth|4|1982|r
Berlin|Take My Breath Away|pop|synth|2|1986|r
Berlin|The Metro|pop|synth|4|1981|
Information Society|What's on Your Mind (Pure Energy)|pop|synth|4|1988|d
Real Life|Send Me an Angel|pop|synth|4|1983|
Camouflage|The Great Commandment|pop|synth|4|1987|
Kraftwerk|Computer Love|pop|synth|3|1981|
Blondie|Heart of Glass|pop|synth|4|1978|d
The Buggles|Video Killed the Radio Star|pop|synth|4|1979|n
Heaven 17|Temptation|pop|synth|5|1983|d
ABC|The Look of Love|pop|synth|4|1982|r
Yello|Oh Yeah|pop|synth|3|1985|
Yello|The Race|pop|synth|5|1988|
Sandra|(I'll Never Be) Maria Magdalena|pop|synth|4|1985|
Modern Talking|You're My Heart, You're My Soul|pop|synth|4|1984|r
Modern Talking|Cheri Cheri Lady|pop|synth|4|1985|
Taxi Girl|Cherchez le garçon|pop|synth|4|1980|
CHVRCHES|Recover|pop|synth|4|2013|
CHVRCHES|Leave a Trace|pop|synth|4|2015|
La Roux|Bulletproof|pop|synth|5|2009|d
La Roux|In for the Kill|pop|synth|4|2009|
Ladytron|Seventeen|pop|synth|4|2002|
The Knife|Heartbeats|pop|synth|3|2002|
Robyn|Dancing On My Own|pop|synth|4|2010|dm
Robyn|Call Your Girlfriend|pop|synth|4|2011|
Cut Copy|Hearts on Fire|pop|synth|4|2008|d
Hot Chip|Over and Over|pop|synth|4|2006|d
Hot Chip|Ready for the Floor|pop|synth|4|2008|d
Purity Ring|Fineshrine|pop|synth|3|2012|
Grimes|Oblivion|pop|synth|3|2012|
Goldfrapp|Ooh La La|pop|synth|4|2005|d
Goldfrapp|Strict Machine|pop|synth|4|2003|d
MGMT|Time to Pretend|pop|indie|4|2008|
Two Door Cinema Club|Undercover Martyn|pop|indie|5|2010|
Two Door Cinema Club|Something Good Can Work|pop|indie|4|2010|j
Vampire Weekend|Harmony Hall|pop|indie|3|2019|
Vampire Weekend|Step|pop|indie|2|2013|n
Passion Pit|Sleepyhead|pop|indie|4|2008|
Lorde|Ribs|pop|indie|3|2013|n
Mitski|Washing Machine Heart|pop|indie|3|2018|
Mitski|My Love Mine All Mine|pop|indie|1|2023|r
Phoebe Bridgers|Kyoto|pop|indie|4|2020|
Glass Animals|Gooey|pop|indie|2|2014|
Beach House|Myth|pop|indie|2|2012|m
Beach House|Take Care|pop|indie|2|2010|r
Alvvays|In Undertow|pop|indie|3|2017|
Clairo|Bags|pop|indie|2|2019|r
Clairo|Pretty Girl|pop|indie|2|2017|
girl in red|i wanna be your girlfriend|pop|indie|3|2018|r
beabadoobee|Coffee|pop|indie|1|2017|r
beabadoobee|Glue Song|pop|indie|2|2023|r
Rex Orange County|Loving Is Easy|pop|indie|3|2017|rj
Rex Orange County|Best Friend|pop|indie|3|2017|j
Cuco|Lo Que Siento|pop|indie|2|2017|r
Still Woozy|Goodie Bag|pop|indie|3|2017|j
Dayglow|Can I Call You Tonight?|pop|indie|3|2018|r
Surf Curse|Freaks|pop|indie|5|2013|
The 1975|Robbers|pop|indie|3|2013|r
Bleachers|I Wanna Get Better|pop|indie|4|2014|
fun.|We Are Young|pop|indie|4|2011|
Matt and Kim|Daylight|pop|indie|4|2009|j
Lykke Li|I Follow Rivers|pop|indie|3|2011|
Metronomy|The Bay|pop|indie|4|2011|d
Metronomy|The Look|pop|indie|3|2011|
Kate Nash|Foundations|pop|indie|3|2007|
Regina Spektor|Fidelity|pop|indie|2|2006|r
Regina Spektor|Samson|pop|indie|1|2006|r
The Magnetic Fields|The Book of Love|pop|indie|1|1999|r
Camera Obscura|Lloyd, I'm Ready to Be Heartbroken|pop|indie|3|2006|
Belle and Sebastian|Get Me Away from Here, I'm Dying|pop|indie|3|1996|
Belle and Sebastian|Another Sunny Day|pop|indie|3|2006|j
Japanese Breakfast|Be Sweet|pop|indie|4|2021|j
Japanese Breakfast|Everybody Wants to Love You|pop|indie|4|2017|
Arlo Parks|Black Dog|pop|indie|1|2020|m
HAIM|The Wire|pop|indie|4|2013|
HAIM|Want You Back|pop|indie|4|2017|
HAIM|Summer Girl|pop|indie|3|2019|j
Chairlift|Bruises|pop|indie|3|2008|r
Washed Out|Feel It All Around|pop|indie|2|2009|n
Cocteau Twins|Heaven or Las Vegas|pop|indie|3|1990|
Mazzy Star|Fade into You|pop|indie|1|1993|rm
The Sundays|Here's Where the Story Ends|pop|indie|3|1990|n
The Cardigans|Lovefool|pop|indie|4|1996|j
Saint Etienne|Only Love Can Break Your Heart|pop|indie|3|1990|
Feist|Mushaboom|pop|indie|3|2004|j
The Shins|Simple Song|pop|indie|4|2012|
Cults|Always Forever|pop|indie|2|2011|r
alt-J|Breezeblocks|pop|indie|3|2012|
Frankie Knuckles|Your Love|electro|house|4|1987|r
Mr. Fingers|Can You Feel It|electro|house|4|1986|i
Robin S.|Show Me Love|electro|house|5|1990|d
CeCe Peniston|Finally|electro|house|5|1991|dj
Crystal Waters|Gypsy Woman (She's Homeless)|electro|house|5|1991|d
Inner City|Good Life|electro|house|5|1988|j
Black Box|Ride on Time|electro|house|5|1989|d
Basement Jaxx|Where's Your Head At|electro|house|5|2001|d
Basement Jaxx|Red Alert|electro|house|5|1999|d
Spiller|Groovejet (If This Ain't Love)|electro|house|4|2000|dj
Roger Sanchez|Another Chance|electro|house|4|2001|
Duke Dumont|Need U (100%)|electro|house|5|2013|d
Route 94|My Love|electro|house|4|2014|d
Shapeshifters|Lola's Theme|electro|house|5|2004|dj
Joe Smooth|Promised Land|electro|house|4|1987|j
Lil Louis|French Kiss|electro|house|4|1989|i
Rhythim Is Rhythim|Strings of Life|electro|techno|4|1987|i
Model 500|No UFO's|electro|techno|4|1985|i
Cybotron|Clear|electro|techno|4|1983|i
Laurent Garnier|Crispy Bacon|electro|techno|5|1997|i
Underworld|Rez|electro|techno|4|1993|i
Underworld|Cowgirl|electro|techno|4|1994|
Underworld|Two Months Off|electro|techno|4|2002|
The Chemical Brothers|Star Guitar|electro|techno|4|2002|
Orbital|Halcyon + On + On|electro|techno|3|1993|i
Orbital|Chime|electro|techno|4|1990|i
Orbital|The Box|electro|techno|3|1996|
Plastikman|Spastik|electro|techno|5|1993|i
Joey Beltram|Energy Flash|electro|techno|5|1990|i
Ben Klock|Subzero|electro|techno|5|2009|i
Stephan Bodzin|Singularity|electro|techno|4|2015|i
Stephan Bodzin|Strand|electro|techno|4|2015|i
Nina Kraviz|Ghetto Kraviz|electro|techno|4|2011|
Maceo Plex|Conjure Superstar|electro|techno|4|2013|i
Moderat|A New Error|electro|techno|3|2009|i
Gesaffelstein|Hate or Glory|electro|techno|5|2013|
Gesaffelstein|Viol|electro|techno|4|2011|i
Vitalic|La Rock 01|electro|techno|5|2001|i
Vitalic|Poney Part 1|electro|techno|5|2001|i
Green Velvet|La La Land|electro|techno|5|2001|
Green Velvet|Flash|electro|techno|5|1995|
Joris Voorn|Incident|electro|techno|4|2004|i
Josh Wink|Higher State of Consciousness|electro|techno|5|1995|i
Hardfloor|Acperience 1|electro|techno|5|1992|i
Aphex Twin|Digeridoo|electro|techno|5|1992|i
Daft Punk|Rollin' & Scratchin'|electro|techno|5|1997|i
Mr. Oizo|Flat Beat|electro|techno|4|1999|i
Ricardo Villalobos|Dexter|electro|techno|3|2003|i
Kiasmos|Looped|electro|techno|3|2014|i
Moby|Feeling So Real|electro|techno|5|1994|
The Prodigy|Voodoo People|electro|techno|5|1994|
Boys Noize|& Down|electro|techno|5|2007|
Kraftwerk|Numbers|electro|techno|4|1981|i
Jon Hopkins|Open Eye Signal|electro|techno|4|2013|i
Kavinsky|Odd Look|electro|synthwave|4|2013|
Kavinsky|Protovision|electro|synthwave|4|2013|i
FM-84|Arcade Summer|electro|synthwave|3|2016|ni
FM-84|Don't Want to Change Your Mind|electro|synthwave|3|2016|n
FM-84|Bend & Break|electro|synthwave|3|2016|
Gunship|Tech Noir|electro|synthwave|4|2015|
Gunship|Dark All Day|electro|synthwave|4|2018|
Gunship|Revel in Your Time|electro|synthwave|4|2015|
Perturbator|Humans Are Such Easy Prey|electro|synthwave|4|2016|
Perturbator|Venger|electro|synthwave|4|2016|
Carpenter Brut|Le Perv|electro|synthwave|5|2012|i
Carpenter Brut|Roller Mobster|electro|synthwave|5|2013|i
Carpenter Brut|Hang'Em All|electro|synthwave|5|2013|i
Power Glove|Blood Dragon Theme|electro|synthwave|4|2013|i
Electric Youth|Runaway|electro|synthwave|3|2014|
Electric Youth|Innocence|electro|synthwave|3|2014|
Chromatics|Tick of the Clock|electro|synthwave|3|2007|i
Chromatics|Shadow|electro|synthwave|2|2013|m
Chromatics|Kill for Love|electro|synthwave|3|2012|
Desire|Under Your Spell|electro|synthwave|3|2009|r
Com Truise|Brokendate|electro|synthwave|3|2011|i
Com Truise|Cathode Girls|electro|synthwave|3|2011|i
Daft Punk|Derezzed|electro|synthwave|5|2010|i
Daft Punk|End of Line|electro|synthwave|3|2010|i
Daft Punk|Tron Legacy (End Titles)|electro|synthwave|3|2010|i
John Carpenter|Halloween Theme|electro|synthwave|3|1978|i
Jan Hammer|Crockett's Theme|electro|synthwave|3|1987|in
Jan Hammer|Miami Vice Theme|electro|synthwave|4|1985|i
Harold Faltermeyer|Axel F|electro|synthwave|4|1984|in
Vince DiCola|Training Montage|electro|synthwave|5|1986|i
Giorgio Moroder|Tony's Theme|electro|synthwave|3|1983|i
Giorgio Moroder|From Here to Eternity|electro|synthwave|4|1977|d
Tangerine Dream|Love on a Real Train|electro|synthwave|2|1983|i
Jean-Michel Jarre|Équinoxe, Pt. 4|electro|synthwave|3|1978|i
Jean-Michel Jarre|Oxygène, Pt. 2|electro|synthwave|3|1976|i
Kraftwerk|Trans-Europe Express|electro|synthwave|3|1977|
Kraftwerk|The Robots|electro|synthwave|3|1978|
M83|Kim & Jessie|electro|synthwave|3|2008|n
M83|Graveyard Girl|electro|synthwave|4|2008|n
The Weeknd|Less Than Zero|electro|synthwave|3|2022|m
The Weeknd|Take My Breath|electro|synthwave|5|2021|d
Anoraak|Nightdrive with You|electro|synthwave|3|2008|n
Real McCoy|Another Night|electro|dance|5|1993|d
Captain Hollywood Project|More and More|electro|dance|5|1992|d
Ice MC|Think About the Way|electro|dance|5|1994|d
Whigfield|Saturday Night|electro|dance|5|1994|dj
Livin' Joy|Dreamer|electro|dance|5|1994|d
Masterboy|Feel the Heat of the Night|electro|dance|5|1994|d
Technotronic|Pump Up the Jam|electro|dance|5|1989|d
C+C Music Factory|Gonna Make You Sweat (Everybody Dance Now)|electro|dance|5|1990|d
2 Unlimited|Get Ready for This|electro|dance|5|1991|d
Vengaboys|Boom, Boom, Boom, Boom!!|electro|dance|5|1998|dj
Vengaboys|We Like to Party! (The Vengabus)|electro|dance|5|1998|dj
ATC|Around the World (La La La La La)|electro|dance|5|2000|dj
DJ BoBo|Chihuahua|electro|dance|5|2002|j
Sash!|Ecuador|electro|dance|5|1997|d
Sash!|Encore une fois|electro|dance|5|1996|d
Mr. President|Coco Jamboo|electro|dance|4|1996|j
Scooter|How Much Is the Fish?|electro|dance|5|1998|
Scooter|Maria (I Like It Loud)|electro|dance|5|2003|
Dr. Alban|Sing Hallelujah!|electro|dance|5|1992|d
Gigi D'Agostino|Bla Bla Bla|electro|dance|5|1999|d
Kate Ryan|Désenchantée|electro|dance|5|2002|
Lasgo|Something|electro|dance|5|2001|
Pendulum|Slam|electro|dnb|5|2005|
Pendulum|Propane Nightmares|electro|dnb|5|2008|
Chase & Status|No Problem|electro|dnb|5|2009|
Chase & Status|Count On Me|electro|dnb|4|2013|
Chase & Status|Baddadan|electro|dnb|5|2023|
Rudimental|Waiting All Night|electro|dnb|4|2013|
Rudimental|Not Giving In|electro|dnb|4|2012|
Netsky|Memory Lane|electro|dnb|4|2010|n
Netsky|Rio|electro|dnb|4|2015|j
Netsky|We Can Only Live Today (Puppy)|electro|dnb|4|2012|
Sub Focus|Rock It|electro|dnb|5|2008|
Sub Focus|Endorphins|electro|dnb|4|2013|
Sub Focus|Out the Blue|electro|dnb|5|2012|
High Contrast|If We Ever|electro|dnb|4|2008|r
High Contrast|Return of Forever|electro|dnb|4|2004|
High Contrast|Racing Green|electro|dnb|4|2002|i
Andy C|Heartbeat Loud|electro|dnb|5|2016|
Shimon & Andy C|Body Rock|electro|dnb|5|1999|
Noisia|Split the Atom|electro|dnb|5|2010|i
DJ Fresh|Gold Dust|electro|dnb|5|2008|
DJ Fresh|Louder|electro|dnb|5|2011|
DJ Fresh|Hot Right Now|electro|dnb|5|2012|d
London Elektricity|Just One Second|electro|dnb|4|2008|
Shy FX & T Power|Shake Ur Body|electro|dnb|4|2002|
Hazard|Mr Happy|electro|dnb|5|2012|
Dillinja|Twist 'Em Out|electro|dnb|5|2003|
Photek|Ni Ten Ichi Ryu|electro|dnb|4|1997|i
Photek|The Hidden Camera|electro|dnb|3|1996|i
Adam F|Circles|electro|dnb|3|1997|i
Origin Unknown|Valley of the Shadows|electro|dnb|4|1993|i
M-Beat|Incredible|electro|dnb|5|1994|d
4hero|Mr. Kirk's Nightmare|electro|dnb|5|1990|i
Omni Trio|Renegade Snares|electro|dnb|5|1993|i
DJ Zinc|Super Sharp Shooter|electro|dnb|5|1996|i
Bad Company UK|The Nine|electro|dnb|5|1998|i
Matrix & Futurebound|Magnetic Eyes|electro|dnb|4|2013|
Sigma|Nobody to Love|electro|dnb|4|2014|d
Sigma|Changing|electro|dnb|4|2014|
Danny Byrd|Ill Behaviour|electro|dnb|5|2010|
Venbee|Messy in Heaven|electro|dnb|4|2022|
Leviticus|The Burial|electro|dnb|5|1994|i
LTJ Bukem|Music|electro|dnb|3|1993|i
LTJ Bukem|Atlantis (I Need You)|electro|dnb|3|1994|i
Alex Reece|Pulp Fiction|electro|dnb|4|1995|i
Alex Reece|Feel the Sunshine|electro|dnb|3|1995|
Roni Size|Heroes|electro|dnb|4|1997|
DJ Marky & XRS|LK (Carolina Carol Bela)|electro|dnb|4|2002|j
Kosheen|Hide U|electro|dnb|4|2000|
Kosheen|Catch|electro|dnb|4|2001|
Squarepusher|Come On My Selector|electro|dnb|5|1997|i
Squarepusher|My Red Hot Car|electro|dnb|4|2001|
Goldie|Angel|electro|dnb|3|1995|
Lennie De Ice|We Are I.E.|electro|dnb|5|1991|i
ATB|Ecstasy|electro|trance|4|2004|
ATB|Don't Stop!|electro|trance|5|1999|d
ATB|The Summer|electro|trance|4|2000|
Robert Miles|Fable|electro|trance|3|1996|i
Robert Miles|One and One|electro|trance|3|1996|r
Tiësto|Traffic|electro|trance|5|2003|i
Tiësto|Lethal Industry|electro|trance|5|2001|i
Tiësto|Love Comes Again|electro|trance|4|2004|
Armin van Buuren|Shivers|electro|trance|4|2005|
Armin van Buuren|In and Out of Love|electro|trance|4|2008|r
Armin van Buuren|Communication|electro|trance|5|1999|i
Above & Beyond|Alone Tonight|electro|trance|4|2006|
Above & Beyond|Blue Sky Action|electro|trance|4|2011|j
Above & Beyond|Good for Me|electro|trance|4|2006|
Paul van Dyk|Nothing but You|electro|trance|4|2003|
Paul van Dyk|We Are Alive|electro|trance|4|2000|
Paul van Dyk|Tell Me Why (The Riddle)|electro|trance|4|2000|
Ferry Corsten|Punk|electro|trance|5|2002|i
Ferry Corsten|Rock Your Body Rock|electro|trance|5|2004|
System F|Cry|electro|trance|4|2001|
Gouryella|Gouryella|electro|trance|5|1999|i
Chicane|Offshore|electro|trance|3|1996|i
Chicane|Don't Give Up|electro|trance|4|2000|
Push|Universal Nation|electro|trance|5|1998|i
Vincent de Moor|Fly Away|electro|trance|4|1997|i
Ayla|Ayla|electro|trance|5|1997|i
Mauro Picotto|Iguana|electro|trance|5|1999|i
Planet Perfecto|Bullet in the Gun|electro|trance|5|1999|i
DJ Sakin & Friends|Protect Your Mind (Braveheart)|electro|trance|5|1998|i
Rank 1|Airwave|electro|trance|5|1999|i
William Orbit|Barber's Adagio for Strings|electro|trance|3|1999|i
BT|Flaming June|electro|trance|4|1997|
BT|Godspeed|electro|trance|5|1998|
Delerium|Silence|electro|trance|3|1999|
Andain|Beautiful Things|electro|trance|3|2003|
Solarstone|Seven Cities|electro|trance|4|1999|i
Oceanlab|Satellite|electro|trance|4|2004|
Cosmic Gate|Exploration of Space|electro|trance|5|2001|i
Cosmic Gate|Fire Wire|electro|trance|5|2001|i
York|On the Beach|electro|trance|4|1999|
Sylver|Turn the Tide|electro|trance|4|2000|
Ian Van Dahl|Castles in the Sky|electro|trance|5|2000|
Gareth Emery|Concrete Angel|electro|trance|4|2012|
Dash Berlin|Till the Sky Falls Down|electro|trance|4|2008|
Fragma|Toca's Miracle|electro|trance|5|2000|d
Darude|Feel the Beat|electro|trance|5|2000|d
Three Drives|Greece 2000|electro|trance|5|1997|i
Paul Oakenfold|Southern Sun|electro|trance|4|2002|
Jam & Spoon|Right in the Night (Fall in Love with Music)|electro|trance|4|1993|
Jam & Spoon|Stella|electro|trance|4|1992|i
Age of Love|The Age of Love|electro|trance|4|1990|i
Dance 2 Trance|Power of American Natives|electro|trance|5|1993|i
Union Jack|Two Full Moons and a Trout|electro|trance|4|1995|i
Humate|Love Stimulation|electro|trance|4|1993|i
Vini Vici|The Tribe|electro|trance|5|2016|i
Infected Mushroom|Becoming Insane|electro|trance|5|2007|
Motorcycle|As the Rush Comes|electro|trance|4|2003|
Schiller|Das Glockenspiel|electro|trance|3|1998|i
DJ Quicksilver|Bellissima|electro|trance|5|1997|i
Nalin & Kane|Beachball|electro|trance|4|1997|i
Dario G|Sunchyme|electro|trance|4|1997|j
Brian Eno|Deep Blue Day|electro|ambient|1|1983|i
Aphex Twin|Xtal|electro|ambient|2|1992|i
Aphex Twin|Ageispolis|electro|ambient|2|1992|i
Aphex Twin|Tha|electro|ambient|2|1992|i
Boards of Canada|Dayvan Cowboy|electro|ambient|3|2005|i
Boards of Canada|Olson|electro|ambient|1|1998|i
Boards of Canada|Everything You Do Is a Balloon|electro|ambient|2|1996|i
Boards of Canada|An Eagle in Your Mind|electro|ambient|2|1998|i
Vangelis|Love Theme|electro|ambient|1|1994|ir
Vangelis|Memories of Green|electro|ambient|1|1980|im
The Orb|A Huge Ever Growing Pulsating Brain That Rules from the Centre of the Ultraworld|electro|ambient|2|1989|
The Orb|Blue Room|electro|ambient|2|1992|i
The Orb|Perpetual Dawn|electro|ambient|3|1991|
Global Communication|14:31|electro|ambient|1|1994|i
Biosphere|Substrata|electro|ambient|1|1997|i
Biosphere|Kobresia|electro|ambient|1|1997|i
William Basinski|dlp 1.1|electro|ambient|1|2002|i
Max Richter|Vladimir's Blues|electro|ambient|1|2004|i
Nils Frahm|Ambre|electro|ambient|1|2009|i
Nils Frahm|Re|electro|ambient|1|2011|i
Jon Hopkins|Immunity|electro|ambient|1|2013|i
Jon Hopkins|Abandon Window|electro|ambient|1|2013|i
Jon Hopkins|Light Through the Veins|electro|ambient|2|2009|i
Moby|God Moving Over the Face of the Waters|electro|ambient|2|1995|i
Moby|Everloving|electro|ambient|2|1999|i
Moby|My Weakness|electro|ambient|1|1999|i
Midori Takada|Mr. Henri Rousseau's Dream|electro|ambient|2|1983|i
Steve Roach|Structures from Silence|electro|ambient|1|1984|i
Tangerine Dream|Phaedra|electro|ambient|2|1974|i
Tangerine Dream|Rubycon (Part One)|electro|ambient|2|1975|i
Carbon Based Lifeforms|Photosynthesis|electro|ambient|2|2003|i
Helios|Halving the Compass|electro|ambient|2|2006|i
Helios|Bless This Morning Year|electro|ambient|2|2006|i
Marconi Union|Weightless|electro|ambient|1|2011|i
Jean-Michel Jarre|Oxygène, Pt. 1|electro|ambient|2|1976|i
Jean-Michel Jarre|Équinoxe, Pt. 1|electro|ambient|1|1978|i
Air|Alone in Kyoto|electro|ambient|2|2004|i
Ryuichi Sakamoto|Merry Christmas Mr. Lawrence|electro|ambient|2|1983|im
Ryuichi Sakamoto|Energy Flow|electro|ambient|1|1999|i
Ryuichi Sakamoto|Andata|electro|ambient|1|2017|i
Jóhann Jóhannsson|Flight from the City|electro|ambient|1|2016|im
The Future Sound of London|Papua New Guinea|electro|ambient|3|1991|
Orbital|Belfast|electro|ambient|2|1991|i
Ólafur Arnalds|Ljósið|electro|ambient|1|2011|i
The Album Leaf|Twentytwofourteen|electro|ambient|2|2001|i
Manuel Göttsching|E2-E4|electro|ambient|2|1984|i
Deep Forest|Sweet Lullaby|electro|ambient|2|1992|
Shpongle|Divine Moments of Truth|electro|ambient|3|1998|
Kylie Minogue|The Loco-Motion|pop|8090|5|1987|d
Tiffany|I Think We're Alone Now|pop|8090|4|1987|
Madonna|Like a Virgin|pop|8090|4|1984|d
Wham!|Freedom|pop|8090|5|1984|j
Pet Shop Boys|Go West|pop|synth|4|1993|
The Human League|Love Action (I Believe in Love)|pop|synth|4|1981|
China Crisis|Wishful Thinking|pop|synth|2|1983|
Trans-X|Living on Video|pop|synth|4|1983|
Gazebo|I Like Chopin|pop|synth|2|1983|r
Ryan Paris|Dolce Vita|pop|synth|4|1983|
Kim Wilde|Cambodia|pop|synth|3|1981|
Nena|99 Luftballons|pop|synth|4|1983|
Propaganda|Duel|pop|synth|4|1985|
Strawberry Switchblade|Since Yesterday|pop|synth|4|1984|
Blancmange|Living on the Ceiling|pop|synth|4|1982|
Future Islands|Seasons (Waiting on You)|pop|synth|3|2014|
Foster the People|Sit Next to Me|pop|indie|3|2017|
Foster the People|Helena Beat|pop|indie|4|2011|
Two Door Cinema Club|I Can Talk|pop|indie|5|2010|
Passion Pit|Little Secrets|pop|indie|4|2009|j
Passion Pit|Carried Away|pop|indie|4|2012|j
Vampire Weekend|Cape Cod Kwassa Kwassa|pop|indie|4|2008|j
Vampire Weekend|This Life|pop|indie|4|2019|j
Lana Del Rey|Born to Die|pop|indie|2|2011|m
Lana Del Rey|West Coast|pop|indie|2|2014|
Lana Del Rey|Brooklyn Baby|pop|indie|2|2014|n
Lorde|Liability|pop|indie|1|2017|m
Mitski|Nobody|pop|indie|3|2018|m
Mitski|First Love / Late Spring|pop|indie|2|2014|m
Phoebe Bridgers|Garden Song|pop|indie|2|2020|
Glass Animals|Youth|pop|indie|3|2016|
The 1975|Girls|pop|indie|4|2014|
The 1975|It's Not Living (If It's Not with You)|pop|indie|4|2018|
Clairo|Juna|pop|indie|2|2023|r
beabadoobee|the perfect pair|pop|indie|3|2022|r
girl in red|Serotonin|pop|indie|4|2021|
Rex Orange County|Pluto Projector|pop|indie|2|2019|
Wallows|Remember When|pop|indie|3|2019|n
Hippo Campus|Buttercup|pop|indie|3|2017|
Bombay Bicycle Club|Shuffle|pop|indie|4|2011|
Bombay Bicycle Club|Always Like This|pop|indie|3|2009|
Grizzly Bear|Two Weeks|pop|indie|3|2009|
Broken Bells|The High Road|pop|indie|3|2010|
Toro y Moi|So Many Details|pop|indie|3|2013|
Animal Collective|My Girls|pop|indie|4|2009|
Neon Indian|Deadbeat Summer|pop|indie|3|2009|n
Real Estate|It's Real|pop|indie|3|2011|
Snail Mail|Pristine|pop|indie|4|2018|
Soccer Mommy|Your Dog|pop|indie|3|2018|
Faye Webster|Kingston|pop|indie|2|2019|r
Boy Pablo|Everytime|pop|indie|3|2018|r
Jungle|Busy Earnin'|pop|indie|4|2014|d
Jungle|Back On 74|pop|indie|4|2023|d
Jungle|Casio|pop|indie|4|2023|d
Feist|I Feel It All|pop|indie|4|2007|j
The Shins|Phantom Limb|pop|indie|3|2007|
Stars|Your Ex-Lover Is Dead|pop|indie|3|2004|m
The Go! Team|Ladyflash|pop|indie|5|2004|j
Architecture in Helsinki|Heart It Races|pop|indie|4|2007|j
Tegan and Sara|Closer|pop|indie|4|2012|d
Sylvan Esso|Coffee|pop|indie|3|2014|
Sylvan Esso|Hey Mami|pop|indie|4|2014|
Lykke Li|Little Bit|pop|indie|3|2008|r
The Drums|Let's Go Surfing|pop|indie|4|2010|j
Best Coast|Boyfriend|pop|indie|4|2010|
Caroline Polachek|So Hot You're Hurting My Feelings|pop|indie|4|2019|
Caroline Polachek|Bunny Is a Rider|pop|indie|4|2021|
Remi Wolf|Photo ID|pop|indie|4|2020|j
Gus Dapperton|Prune, You Talk Funny|pop|indie|3|2017|
Dominic Fike|3 Nights|pop|indie|3|2018|
Steve Lacy|Bad Habit|pop|indie|3|2022|
The Marías|No One Noticed|pop|indie|3|2024|m
TV Girl|Not Allowed|pop|indie|3|2014|
Mother Mother|Hayloft|pop|indie|5|2008|
Cigarettes After Sex|Apocalypse|pop|indie|1|2017|r
Cigarettes After Sex|Sunsetz|pop|indie|1|2017|r
Alvvays|Dreams Tonite|pop|indie|3|2017|r
Booba|Pitbull|rap|fr|4|2006|
Booba|0.9|rap|fr|3|2008|
PNL|Naha|rap|fr|3|2016|m
PNL|J'suis QLF|rap|fr|3|2015|
Nekfeu|Princesse|rap|fr|3|2015|r
Damso|Feu de bois|rap|fr|3|2018|
SCH|A7|rap|fr|3|2015|
Niska|Réseaux|rap|fr|4|2017|d
Niska|Commando|rap|fr|5|2017|d
MHD|Afro Trap Part. 3 (Champions League)|rap|fr|5|2016|d
Kaaris|Zoo|rap|fr|5|2013|
Sexion d'Assaut|Désolé|rap|fr|3|2010|m
Sexion d'Assaut|Avant qu'elle parte|rap|fr|3|2012|
Bigflo & Oli|Plus tard|rap|fr|3|2018|n
Bigflo & Oli|Demain|rap|fr|4|2018|
Naps|La kiffance|rap|fr|4|2020|dj
Soolking|Dalida|rap|fr|4|2018|d
La Fouine|Du ferme|rap|fr|4|2011|
Diam's|Jeune demoiselle|rap|fr|4|2006|
Diam's|Confessions nocturnes|rap|fr|3|2006|m
Roméo Elvis|Malade|rap|fr|3|2019|
Soprano|Mon précieux|rap|fr|3|2014|
Naza|Joli bébé|rap|fr|4|2017|d
Vegedream|Ramenez la coupe à la maison|rap|fr|5|2018|dj
Lil Wayne|A Milli|rap|us|4|2008|
T.I.|Whatever You Like|rap|us|3|2008|r
Kanye West|Power|rap|us|5|2010|
Kanye West|Flashing Lights|rap|us|3|2007|
Jay-Z|99 Problems|rap|us|5|2003|
Lil Uzi Vert|XO Tour Llif3|rap|us|4|2017|m
Migos|Walk It Talk It|rap|us|4|2018|d
Roddy Ricch|The Box|rap|us|4|2019|
Pop Smoke|Dior|rap|us|5|2019|
J. Cole|Middle Child|rap|us|4|2019|
Wiz Khalifa|Black and Yellow|rap|us|4|2010|
Chance the Rapper|No Problem|rap|us|4|2016|j
B.o.B|Airplanes|rap|us|3|2010|m
Mac Miller|Good News|rap|us|2|2020|m
Jack Harlow|First Class|rap|us|3|2022|
IAM|L'empire du côté obscur|hiphop|fr|4|1997|
IAM|Planète Mars|hiphop|fr|3|1991|
MC Solaar|Obsolète|hiphop|fr|3|1994|
Suprême NTM|Paris sous les bombes|hiphop|fr|3|1995|
Suprême NTM|That's My People|hiphop|fr|4|1998|d
Suprême NTM|Le monde de demain|hiphop|fr|4|1991|
Oxmo Puccino|Mama Lova|hiphop|fr|2|1998|r
Mafia K'1 Fry|Pour ceux|hiphop|fr|4|2003|
Sniper|Pris pour cible|hiphop|fr|4|2001|
Ideal J|Hardcore|hiphop|fr|5|1998|
Stomy Bugsy|Mon papa à moi est un gangster|hiphop|fr|3|1996|
Neg' Marrons|Le bilan|hiphop|fr|3|2000|
Doc Gynéco|Dans ma rue|hiphop|fr|2|1996|m
Doc Gynéco|Viens voir le docteur|hiphop|fr|3|1996|
Ärsenik|Quelques gouttes suffisent|hiphop|fr|3|1998|
Ménélik|Bye Bye|hiphop|fr|3|1997|r
Alliance Ethnik|Simple et funky|hiphop|fr|4|1995|dj
Alliance Ethnik|Respect|hiphop|fr|4|1995|d
Abd al Malik|Gibraltar|hiphop|fr|3|2006|
Kery James|À l'ombre du show business|hiphop|fr|3|2008|m
Run-DMC|Walk This Way|hiphop|us|5|1986|d
LL Cool J|I Need Love|hiphop|us|2|1987|r
Beastie Boys|(You Gotta) Fight for Your Right (To Party!)|hiphop|us|5|1986|j
A Tribe Called Quest|Electric Relaxation|hiphop|us|3|1993|
A Tribe Called Quest|Scenario|hiphop|us|5|1991|
De La Soul|The Magic Number|hiphop|us|4|1989|j
Eric B. & Rakim|I Know You Got Soul|hiphop|us|4|1987|
Nas|The World Is Yours|hiphop|us|3|1994|
The Notorious B.I.G.|Mo Money Mo Problems|hiphop|us|4|1997|d
2Pac|Keep Ya Head Up|hiphop|us|3|1993|
Gang Starr|Moment of Truth|hiphop|us|3|1998|
Fugees|Killing Me Softly With His Song|hiphop|us|2|1996|m
Kurtis Blow|The Breaks|hiphop|us|4|1980|d
Afrika Bambaataa & The Soulsonic Force|Planet Rock|hiphop|us|5|1982|d
Young MC|Bust a Move|hiphop|us|4|1989|dj
Missy Elliott|The Rain (Supa Dupa Fly)|hiphop|us|3|1997|
Otis Redding|These Arms of Mine|soul|soul|1|1962|r
The Temptations|Ain't Too Proud to Beg|soul|soul|4|1966|
Sam Cooke|Bring It On Home to Me|soul|soul|2|1962|r
Curtis Mayfield|Move On Up|soul|soul|4|1970|j
Al Green|Tired of Being Alone|soul|soul|2|1971|m
Gladys Knight & The Pips|Midnight Train to Georgia|soul|soul|2|1973|m
Four Tops|Reach Out I'll Be There|soul|soul|4|1966|
Jackie Wilson|(Your Love Keeps Lifting Me) Higher and Higher|soul|soul|4|1967|j
Sade|Smooth Operator|soul|soul|2|1984|
Sade|No Ordinary Love|soul|soul|2|1992|r
James Brown|Get Up Offa That Thing|soul|funk|5|1976|d
James Brown|Cold Sweat|soul|funk|4|1967|d
Stevie Wonder|Higher Ground|soul|funk|4|1973|
Stevie Wonder|Boogie On Reggae Woman|soul|funk|3|1974|d
Earth, Wind & Fire|Shining Star|soul|funk|4|1975|d
Earth, Wind & Fire|Getaway|soul|funk|5|1976|d
Parliament|Flash Light|soul|funk|4|1977|d
Funkadelic|(Not Just) Knee Deep|soul|funk|4|1979|d
George Clinton|Atomic Dog|soul|funk|4|1982|d
Rick James|Give It to Me Baby|soul|funk|5|1981|d
Zapp|More Bounce to the Ounce|soul|funk|4|1980|d
Cameo|Word Up!|soul|funk|5|1986|d
Cameo|Candy|soul|funk|4|1986|d
The Gap Band|Oops Up Side Your Head|soul|funk|5|1979|dj
The Gap Band|Outstanding|soul|funk|3|1982|d
Ohio Players|Fire|soul|funk|5|1974|d
Ohio Players|Love Rollercoaster|soul|funk|4|1975|d
Kool & the Gang|Jungle Boogie|soul|funk|5|1973|d
Kool & the Gang|Hollywood Swinging|soul|funk|4|1974|dj
The Isley Brothers|It's Your Thing|soul|funk|4|1969|d
Sly & the Family Stone|Thank You (Falettinme Be Mice Elf Agin)|soul|funk|4|1969|d
Sly & the Family Stone|If You Want Me to Stay|soul|funk|3|1973|
Curtis Mayfield|Superfly|soul|funk|3|1972|
Isaac Hayes|Theme from Shaft|soul|funk|4|1971|
War|Low Rider|soul|funk|3|1975|d
War|Why Can't We Be Friends?|soul|funk|3|1975|j
The Meters|Hey Pocky A-Way|soul|funk|4|1974|d
Average White Band|Pick Up the Pieces|soul|funk|4|1974|id
Commodores|Machine Gun|soul|funk|4|1974|id
Rufus|Tell Me Something Good|soul|funk|3|1974|
Prince|I Wanna Be Your Lover|soul|funk|4|1979|d
The Brothers Johnson|Strawberry Letter 23|soul|funk|3|1977|
Lyn Collins|Think (About It)|soul|funk|5|1972|d
The Bar-Kays|Soul Finger|soul|funk|5|1967|dj
Booker T. & the M.G.'s|Green Onions|soul|funk|3|1962|i
Lakeside|Fantastic Voyage|soul|funk|4|1980|d
Mtume|Juicy Fruit|soul|funk|2|1983|r
Bruno Mars|24K Magic|soul|funk|5|2016|d
Vulfpeck|Back Pocket|soul|funk|4|2015|d
Marvin Gaye|Got to Give It Up|soul|funk|4|1977|d
The Temptations|Papa Was a Rollin' Stone|soul|funk|3|1972|
Billy Preston|Will It Go Round in Circles|soul|funk|4|1973|j
The Time|Jungle Love|soul|funk|5|1984|d
Tower of Power|Soul Vaccination|soul|funk|4|1973|
Maze|Before I Let Go|soul|funk|4|1981|dj
Donna Summer|Last Dance|soul|disco|5|1978|d
Chic|Everybody Dance|soul|disco|5|1977|d
Sister Sledge|Lost in Music|soul|disco|5|1979|d
Gloria Gaynor|Never Can Say Goodbye|soul|disco|4|1974|d
Kool & the Gang|Ladies' Night|soul|disco|4|1979|d
Village People|In the Navy|soul|disco|5|1979|dj
Village People|Macho Man|soul|disco|5|1978|dj
Boney M.|Ma Baker|soul|disco|5|1977|d
The Jacksons|Shake Your Body (Down to the Ground)|soul|disco|5|1978|d
Anita Ward|Ring My Bell|soul|disco|4|1979|dj
Cheryl Lynn|Got to Be Real|soul|disco|5|1978|d
Thelma Houston|Don't Leave Me This Way|soul|disco|5|1976|d
Van McCoy|The Hustle|soul|disco|4|1975|id
A Taste of Honey|Boogie Oogie Oogie|soul|disco|5|1978|d
The Emotions|Best of My Love|soul|disco|4|1977|dj
McFadden & Whitehead|Ain't No Stoppin' Us Now|soul|disco|4|1979|dj
Evelyn "Champagne" King|Shame|soul|disco|5|1977|d
Yvonne Elliman|If I Can't Have You|soul|disco|4|1977|m
Sylvester|You Make Me Feel (Mighty Real)|soul|disco|5|1978|d
Peaches & Herb|Shake Your Groove Thing|soul|disco|5|1978|dj
Alicia Bridges|I Love the Nightlife (Disco 'Round)|soul|disco|4|1978|d
Amii Stewart|Knock on Wood|soul|disco|5|1979|d
Carl Douglas|Kung Fu Fighting|soul|disco|4|1974|j
The Hues Corporation|Rock the Boat|soul|disco|3|1973|d
Hot Chocolate|You Sexy Thing|soul|disco|4|1975|d
Baccara|Yes Sir, I Can Boogie|soul|disco|3|1977|d
Ottawan|D.I.S.C.O.|soul|disco|5|1979|dj
Ottawan|Hands Up (Give Me Your Heart)|soul|disco|5|1980|dj
Dan Hartman|Instant Replay|soul|disco|5|1978|d
Rod Stewart|Da Ya Think I'm Sexy?|soul|disco|4|1978|d
Madonna|Hung Up|soul|disco|5|2005|d
Odyssey|Native New Yorker|soul|disco|4|1977|d
Heatwave|Boogie Nights|soul|disco|4|1976|d
Shalamar|A Night to Remember|soul|disco|4|1982|d
Peter Tosh|Equal Rights|reggae|roots|3|1977|
Burning Spear|Slavery Days|reggae|roots|2|1975|
Toots and the Maytals|Funky Kingston|reggae|roots|4|1973|d
Third World|Now That We Found Love|reggae|roots|4|1978|dj
Culture|Two Sevens Clash|reggae|roots|3|1977|
Buju Banton|Untold Stories|reggae|roots|1|1995|m
Shaggy|Oh Carolina|reggae|dancehall|5|1993|dj
Beenie Man|Dude|reggae|dancehall|4|2004|d
Beenie Man|Girls Dem Sugar|reggae|dancehall|4|2000|d
Beenie Man|King of the Dancehall|reggae|dancehall|5|2004|d
Bounty Killer|Look Into My Eyes|reggae|dancehall|4|1997|
Buju Banton|Champion|reggae|dancehall|5|1995|d
Buju Banton|Wanna Be Loved|reggae|dancehall|3|1995|r
Shabba Ranks|Housecall|reggae|dancehall|3|1991|r
Chaka Demus & Pliers|Murder She Wrote|reggae|dancehall|4|1992|d
Chaka Demus & Pliers|Twist and Shout|reggae|dancehall|5|1993|dj
Yellowman|Zungguzungguguzungguzeng|reggae|dancehall|4|1983|d
Vybz Kartel|Clarks|reggae|dancehall|4|2010|
Mavado|So Special|reggae|dancehall|3|2009|r
Busy Signal|Watch Out for This (Bumaye)|reggae|dancehall|5|2013|d
Kranium|Nobody Has to Know|reggae|dancehall|3|2013|r
Gyptian|Hold You|reggae|dancehall|3|2010|r
Sean Kingston|Beautiful Girls|reggae|dancehall|3|2007|m
Rihanna|Pon de Replay|reggae|dancehall|5|2005|d
Rihanna|Work|reggae|dancehall|4|2016|d
Major Lazer|Pon de Floor|reggae|dancehall|5|2009|d
Kevin Lyttle|Turn Me On|reggae|dancehall|4|2003|dr
Wayne Wonder|No Letting Go|reggae|dancehall|3|2002|r
Tanto Metro & Devonte|Everyone Falls in Love|reggae|dancehall|3|2000|r
Koffee|Rapture|reggae|dancehall|4|2019|j
Barrington Levy|Here I Come|reggae|dancehall|4|1984|d
Sister Nancy|Bam Bam|reggae|dancehall|4|1982|d
Ini Kamoze|Here Comes the Hotstepper|reggae|dancehall|4|1994|d
Snow|Informer|reggae|dancehall|4|1992|dn
Dawn Penn|You Don't Love Me (No, No, No)|reggae|dancehall|3|1994|m
Tenor Saw|Ring the Alarm|reggae|dancehall|4|1985|d
Wayne Smith|Under Mi Sleng Teng|reggae|dancehall|4|1985|d
Mad Cobra|Flex|reggae|dancehall|4|1992|d
Cham|Ghetto Story|reggae|dancehall|3|2006|
Serani|No Games|reggae|dancehall|3|2008|r
Tryo|La main verte|reggae|fr|3|1998|j
Tonton David|Chacun sa route|reggae|fr|3|1995|
Kana|Plantation|reggae|fr|3|1998|
Princess Erika|Trop de bla-bla|reggae|fr|4|1989|d
Yannick Noah|Saga Africa|reggae|fr|5|1991|dj
Serge Gainsbourg|Aux armes et cætera|reggae|fr|3|1979|
Serge Gainsbourg|Lola Rastaquouère|reggae|fr|3|1979|
Serge Gainsbourg|Marilou Reggae|reggae|fr|2|1979|
Bernard Lavilliers|Stand the Ghetto|reggae|fr|3|1980|
B.B. King|Rock Me Baby|blues|blues|3|1964|
John Lee Hooker|Boogie Chillen|blues|blues|4|1948|d
John Lee Hooker|Dimples|blues|blues|4|1956|d
Howlin' Wolf|Killing Floor|blues|blues|4|1964|
Elmore James|The Sky Is Crying|blues|blues|2|1959|m
Albert King|Crosscut Saw|blues|blues|4|1967|
Albert Collins|Frosty|blues|blues|4|1962|i
T-Bone Walker|Call It Stormy Monday (But Tuesday Is Just as Bad)|blues|blues|2|1947|m
Little Walter|Juke|blues|blues|4|1952|i
Sonny Boy Williamson II|Help Me|blues|blues|3|1963|
Jimmy Reed|Bright Lights, Big City|blues|blues|3|1961|
Jimmy Reed|Baby What You Want Me to Do|blues|blues|3|1959|
Big Mama Thornton|Hound Dog|blues|blues|4|1952|
Koko Taylor|Wang Dang Doodle|blues|blues|4|1966|d
Otis Rush|I Can't Quit You Baby|blues|blues|2|1956|m
Junior Wells|Messin' with the Kid|blues|blues|4|1960|j
Lightnin' Hopkins|Mojo Hand|blues|blues|3|1960|
Bobby "Blue" Bland|Turn On Your Love Light|blues|blues|4|1961|d
Freddie King|Have You Ever Loved a Woman|blues|blues|2|1960|m
Stevie Ray Vaughan|Cold Shot|blues|blues|3|1984|
Fleetwood Mac|Need Your Love So Bad|blues|blues|1|1968|r
Robert Cray|Smoking Gun|blues|blues|3|1986|
Cat Stevens|Moonshadow|blues|folk|2|1971|j
Nick Drake|Northern Sky|blues|folk|2|1970|r
Elliott Smith|Between the Bars|blues|folk|1|1997|m
Joni Mitchell|A Case of You|blues|folk|1|1971|r
Leonard Cohen|Hallelujah|blues|folk|1|1984|m
Kings of Convenience|Misread|blues|folk|2|2004|
The Paper Kites|Bloom|blues|folk|1|2011|r
Gregory Alan Isakov|Big Black Car|blues|folk|1|2013|m
Joan Baez|Here's to You|blues|folk|1|1971|
Iron & Wine|Naked As We Came|blues|folk|1|2004|r
Simon & Garfunkel|Homeward Bound|blues|folk|2|1966|n
Bon Iver|Flume|blues|folk|1|2007|m
Celia Cruz|Ríe y Llora|latino|tropical|4|2003|j
Marc Anthony|Tu Amor Me Hace Bien|latino|tropical|4|2004|dr
Marc Anthony|Flor Pálida|latino|tropical|4|2013|dm
Héctor Lavoe|Periódico de Ayer|latino|tropical|4|1976|d
Héctor Lavoe|Mi Gente|latino|tropical|5|1975|d
Willie Colón|Che Che Colé|latino|tropical|5|1969|d
Rubén Blades|Plástico|latino|tropical|4|1978|d
Joe Arroyo|En Barranquilla Me Quedo|latino|tropical|4|1988|dj
Grupo Niche|Una Aventura|latino|tropical|4|1989|dr
Fruko y Sus Tesos|El Preso|latino|tropical|4|1975|dm
Juan Luis Guerra|Ojalá Que Llueva Café|latino|tropical|3|1989|j
Juan Luis Guerra|Bachata Rosa|latino|tropical|2|1990|r
Romeo Santos|Eres Mía|latino|tropical|3|2014|dr
Romeo Santos|Imitadora|latino|tropical|3|2017|dm
Aventura|Los Infieles|latino|tropical|3|2006|d
Prince Royce|Stand by Me|latino|tropical|3|2010|dr
Prince Royce|Corazón Sin Cara|latino|tropical|3|2010|r
Elvis Crespo|Suavemente|latino|tropical|5|1998|dj
Carlos Vives|La Gota Fría|latino|tropical|4|1993|d
Gloria Estefan|Mi Tierra|latino|tropical|4|1993|dn
Bomba Estéreo|Soy Yo|latino|tropical|4|2015|dj
Manuel Turizo|La Bachata|latino|tropical|3|2022|dr
Frankie Ruiz|Tú Con Él|latino|tropical|4|1985|d
Lalo Rodríguez|Ven, Devórame Otra Vez|latino|tropical|4|1988|dr
Daddy Yankee|Rompe|latino|reggaeton|5|2005|d
Don Omar|Dile|latino|reggaeton|4|2003|d
Don Omar|Salió el Sol|latino|reggaeton|5|2009|dj
Wisin & Yandel|Abusadora|latino|reggaeton|4|2009|d
Ivy Queen|Quiero Bailar|latino|reggaeton|4|2003|d
Calle 13|Atrévete-te-te|latino|reggaeton|5|2005|dj
Zion & Lennox|Otra Vez|latino|reggaeton|4|2016|d
Nicky Jam|Hasta el Amanecer|latino|reggaeton|4|2016|dr
Nicky Jam|Travesuras|latino|reggaeton|4|2014|d
J Balvin|Ay Vamos|latino|reggaeton|4|2014|d
Maluma|Hawái|latino|reggaeton|3|2020|m
Maluma|Borró Cassette|latino|reggaeton|4|2015|d
Ozuna|Se Preparó|latino|reggaeton|4|2017|d
Ozuna|Baila Baila Baila|latino|reggaeton|5|2018|d
Karol G|Bichota|latino|reggaeton|5|2020|d
Karol G|Si Antes Te Hubiera Conocido|latino|reggaeton|4|2024|dj
Anuel AA|Secreto|latino|reggaeton|3|2019|r
Farruko|Pepas|latino|reggaeton|5|2021|d
Feid|Feliz Cumpleaños Ferxxo|latino|reggaeton|4|2022|d
Feid|Luna|latino|reggaeton|3|2023|r
Myke Towers|Diosa|latino|reggaeton|4|2020|d
Sech|Relación|latino|reggaeton|3|2020|d
Yandel|Encantadora|latino|reggaeton|4|2015|dr
Natti Natasha|Criminal|latino|reggaeton|4|2017|d
Manuel Turizo|Una Lady Como Tú|latino|reggaeton|3|2016|r
CNCO|Reggaetón Lento (Bailemos)|latino|reggaeton|4|2016|d
Wisin|Escápate Conmigo|latino|reggaeton|4|2017|d
Tito El Bambino|El Amor|latino|reggaeton|3|2009|r
Lunay|Soltera|latino|reggaeton|4|2019|d
Enrique Iglesias|Bailamos|latino|pop|4|1999|d
Enrique Iglesias|Súbeme la Radio|latino|pop|4|2017|d
Ricky Martin|Vente Pa' Ca|latino|pop|4|2016|d
Juanes|Es Por Ti|latino|pop|3|2002|r
Juanes|Me Enamora|latino|pop|4|2007|rj
Alejandro Sanz|Y Si Fuera Ella|latino|pop|2|1997|r
Alejandro Sanz|Amiga Mía|latino|pop|2|1997|m
Luis Miguel|Ahora Te Puedes Marchar|latino|pop|4|1987|
Julieta Venegas|Me Voy|latino|pop|3|2006|m
Julieta Venegas|Limón y Sal|latino|pop|3|2006|r
Reik|Yo Quisiera|latino|pop|2|2005|r
Reik|Me Niego|latino|pop|3|2018|d
Camila|Todo Cambió|latino|pop|2|2006|m
Jesse & Joy|Espacio Sideral|latino|pop|2|2011|r
Maná|Clavado en un Bar|latino|pop|4|1997|
Maná|Oye Mi Amor|latino|pop|4|1992|r
Soda Stereo|Persiana Americana|latino|pop|4|1986|
Gustavo Cerati|Crimen|latino|pop|2|2006|m
Enanitos Verdes|Lamento Boliviano|latino|pop|3|1994|m
Los Prisioneros|Tren al Sur|latino|pop|4|1990|n
Thalía|Amor a la Mexicana|latino|pop|4|1997|d
Paulina Rubio|Y Yo Sigo Aquí|latino|pop|5|2000|d
Sebastián Yatra|Tacones Rojos|latino|pop|4|2021|dj
Morat|Besos en Guerra|latino|pop|3|2018|r
Pablo Alborán|Solamente Tú|latino|pop|1|2010|r
Mon Laferte|Tu Falta de Querer|latino|pop|2|2015|m
Ricardo Arjona|Historia de Taxi|latino|pop|2|1993|n
Chayanne|Torero|latino|pop|5|2002|d
Chayanne|Dejaría Todo|latino|pop|2|1998|r
La Oreja de Van Gogh|Rosas|latino|pop|3|2003|m
La Oreja de Van Gogh|Puedes Contar Conmigo|latino|pop|3|2003|r
Amaral|Sin Ti No Soy Nada|latino|pop|2|2002|m
Danny Ocean|Me Rehúso|latino|pop|3|2016|r
Pedro Capó|Calma|latino|pop|3|2018|j
Luis Fonsi|Échame la Culpa|latino|pop|4|2017|d
Manu Chao|Bongo Bong|latino|pop|3|1998|j
Selena|Bidi Bidi Bom Bom|latino|pop|4|1994|dj
Selena|Como la Flor|latino|pop|3|1992|m
Camilo|Vida de Rico|latino|pop|3|2020|r
Kali Uchis|telepatía|latino|pop|2|2020|r
Paco de Lucía|Almoraima|latino|flamenco|3|1976|i
Paco de Lucía|Zyryab|latino|flamenco|4|1990|i
Camarón de la Isla|Volando Voy|latino|flamenco|4|1979|
Camarón de la Isla|Soy Gitano|latino|flamenco|3|1989|
Estopa|Por la Raja de Tu Falda|latino|flamenco|4|1999|j
Estopa|Tu Calorro|latino|flamenco|4|1999|
Rosalía|Pienso en Tu Mirá|latino|flamenco|3|2018|
Rosalía|Di Mi Nombre|latino|flamenco|2|2018|r
Rosalía|Bagdad|latino|flamenco|2|2018|m
Peret|Borriquito|latino|flamenco|5|1971|dj
Peret|Canta y Sé Feliz|latino|flamenco|4|1974|j
Los Chunguitos|Me Quedo Contigo|latino|flamenco|2|1980|r
Las Grecas|Te Estoy Amando Locamente|latino|flamenco|4|1973|rn
Los Chichos|Quiero Ser Libre|latino|flamenco|3|1974|n
Las Ketchup|Aserejé|latino|flamenco|5|2002|dj
Azúcar Moreno|Bandido|latino|flamenco|5|1990|d
Bebe|Malo|latino|flamenco|3|2004|
Bebe|Siempre Me Quedará|latino|flamenco|2|2004|m
Kiko Veneno|Echo de Menos|latino|flamenco|3|1992|m
Chambao|Pokito a Poko|latino|flamenco|2|2005|
Glenn Miller|Chattanooga Choo Choo|jazz|swing|4|1941|jd
Glenn Miller|Pennsylvania 6-5000|jazz|swing|4|1940|id
Benny Goodman|Stompin' at the Savoy|jazz|swing|4|1936|id
Benny Goodman|Don't Be That Way|jazz|swing|4|1938|id
Benny Goodman|Let's Dance|jazz|swing|3|1935|id
Count Basie|Jumpin' at the Woodside|jazz|swing|5|1938|id
Count Basie|Li'l Darlin'|jazz|swing|1|1958|i
Duke Ellington|Caravan|jazz|swing|3|1937|i
Duke Ellington|Satin Doll|jazz|swing|2|1953|i
Artie Shaw|Begin the Beguine|jazz|swing|3|1938|id
Artie Shaw|Frenesi|jazz|swing|3|1940|i
Tommy Dorsey|Song of India|jazz|swing|3|1937|i
Tommy Dorsey|I'm Getting Sentimental Over You|jazz|swing|2|1935|ir
Tommy Dorsey|Opus One|jazz|swing|4|1944|id
Lionel Hampton|Flying Home|jazz|swing|5|1942|id
Lionel Hampton|Hamp's Boogie Woogie|jazz|swing|5|1944|id
Jimmie Lunceford|For Dancers Only|jazz|swing|4|1937|id
Woody Herman|At the Woodchopper's Ball|jazz|swing|4|1939|id
Charlie Barnet|Cherokee|jazz|swing|4|1939|id
Cab Calloway|The Jumpin' Jive|jazz|swing|4|1939|jd
Ella Fitzgerald|A-Tisket, A-Tasket|jazz|swing|3|1938|j
Fats Waller|Honeysuckle Rose|jazz|swing|3|1934|j
Fats Waller|The Joint Is Jumpin'|jazz|swing|4|1937|j
Louis Jordan|Caldonia|jazz|swing|5|1945|jd
Louis Jordan|Choo Choo Ch'Boogie|jazz|swing|5|1946|jd
Louis Jordan|Let the Good Times Roll|jazz|swing|4|1946|j
The Andrews Sisters|Boogie Woogie Bugle Boy|jazz|swing|5|1941|jd
The Andrews Sisters|Bei Mir Bist Du Schön|jazz|swing|4|1937|j
Frank Sinatra|You Make Me Feel So Young|jazz|swing|4|1956|j
Bobby Darin|Mack the Knife|jazz|swing|4|1959|j
Louis Prima|Jump, Jive an' Wail|jazz|swing|5|1956|jd
Coleman Hawkins|Body and Soul|jazz|swing|1|1939|ir
Erskine Hawkins|Tuxedo Junction|jazz|swing|3|1939|i
Gene Krupa|Let Me Off Uptown|jazz|swing|4|1941|j
Harry James|Sleepy Lagoon|jazz|swing|1|1942|ir
Les Brown|Sentimental Journey|jazz|swing|2|1945|n
Louis Armstrong|Swing That Music|jazz|swing|4|1936|j
Sidney Bechet|Les Oignons|jazz|swing|4|1949|ij
Sidney Bechet|Si tu vois ma mère|jazz|swing|1|1952|in
Bunny Berigan|I Can't Get Started|jazz|swing|1|1937|r
Chick Webb|Stompin' at the Savoy|jazz|swing|4|1934|id
Claude Thornhill|Snowfall|jazz|swing|1|1941|i
Dean Martin|Ain't That a Kick in the Head|jazz|swing|4|1960|j
Caro Emerald|Back It Up|jazz|swing|4|2009|d
Caravan Palace|Rock It for Me|jazz|swing|5|2012|d
Caravan Palace|Dramophone|jazz|swing|5|2008|d
Parov Stelar|Catgroove|jazz|swing|4|2009|d
Parov Stelar|All Night|jazz|swing|5|2012|d
Squirrel Nut Zippers|Hell|jazz|swing|4|1996|j
Cherry Poppin' Daddies|Zoot Suit Riot|jazz|swing|5|1997|d
Dave Brubeck|It's a Raggy Waltz|jazz|cool|3|1961|ij
Dave Brubeck|Unsquare Dance|jazz|cool|4|1961|i
Chet Baker|But Not for Me|jazz|cool|2|1954|r
Chet Baker|Time After Time|jazz|cool|1|1954|r
Gerry Mulligan|Line for Lyons|jazz|cool|2|1952|i
Gerry Mulligan|Walkin' Shoes|jazz|cool|3|1953|i
Gerry Mulligan|Bernie's Tune|jazz|cool|3|1952|i
Bill Evans|My Foolish Heart|jazz|cool|1|1961|ir
Bill Evans|Autumn Leaves|jazz|cool|3|1960|i
Thelonious Monk|Blue Monk|jazz|cool|2|1954|i
Thelonious Monk|Ruby, My Dear|jazz|cool|1|1947|ir
Thelonious Monk|Well, You Needn't|jazz|cool|3|1947|i
John Coltrane|Blue Train|jazz|cool|3|1957|i
Cannonball Adderley|Autumn Leaves|jazz|cool|2|1958|im
Cannonball Adderley|One for Daddy-O|jazz|cool|2|1958|i
Nat Adderley|Work Song|jazz|cool|3|1960|i
Art Blakey & The Jazz Messengers|Blues March|jazz|cool|4|1958|i
Art Blakey & The Jazz Messengers|Along Came Betty|jazz|cool|3|1958|i
Horace Silver|The Preacher|jazz|cool|4|1955|ij
Horace Silver|Señor Blues|jazz|cool|3|1956|i
Lee Morgan|Ceora|jazz|cool|2|1965|i
Lee Morgan|The Rumproller|jazz|cool|4|1965|i
Hank Mobley|Soul Station|jazz|cool|3|1960|i
Hank Mobley|This I Dig of You|jazz|cool|4|1960|i
Sonny Rollins|Blue 7|jazz|cool|2|1956|i
Sonny Rollins|You Don't Know What Love Is|jazz|cool|1|1956|im
Clifford Brown|Joy Spring|jazz|cool|3|1955|ij
Clifford Brown|Daahoud|jazz|cool|4|1955|i
Kenny Burrell|Chitlins con Carne|jazz|cool|2|1963|i
Kenny Burrell|Midnight Blue|jazz|cool|2|1963|i
Jimmy Smith|Back at the Chicken Shack|jazz|cool|3|1963|i
Jimmy Smith|The Cat|jazz|cool|4|1964|i
Wes Montgomery|Four on Six|jazz|cool|4|1960|i
Wes Montgomery|West Coast Blues|jazz|cool|3|1960|i
The Modern Jazz Quartet|Django|jazz|cool|1|1956|im
Dexter Gordon|Cheese Cake|jazz|cool|4|1962|i
Joe Henderson|Blue Bossa|jazz|cool|3|1963|i
Joe Henderson|Recorda Me|jazz|cool|3|1963|i
Oliver Nelson|Stolen Moments|jazz|cool|2|1961|i
Art Pepper|You'd Be So Nice to Come Home To|jazz|cool|3|1957|i
Wayne Shorter|Footprints|jazz|cool|3|1966|i
Wayne Shorter|Speak No Evil|jazz|cool|2|1966|i
Sonny Clark|Cool Struttin'|jazz|cool|3|1958|i
Grant Green|Idle Moments|jazz|cool|1|1965|i
Bud Powell|Un Poco Loco|jazz|cool|4|1951|i
Ahmad Jamal|But Not for Me|jazz|cool|2|1958|i
Oscar Peterson|Hymn to Freedom|jazz|cool|1|1963|i
Herbie Hancock|Maiden Voyage|jazz|cool|2|1965|i
Herbie Hancock|Dolphin Dance|jazz|cool|2|1965|i
Lou Donaldson|Blues Walk|jazz|cool|3|1958|i
Lou Donaldson|Alligator Bogaloo|jazz|cool|4|1967|id
Freddie Hubbard|Hub-Tones|jazz|cool|4|1962|i
Ella Fitzgerald|Ev'ry Time We Say Goodbye|jazz|vocal|1|1956|rm
Billie Holiday|God Bless the Child|jazz|vocal|1|1941|m
Billie Holiday|All of Me|jazz|vocal|2|1941|r
Sarah Vaughan|Lullaby of Birdland|jazz|vocal|3|1954|
Sarah Vaughan|Broken-Hearted Melody|jazz|vocal|2|1959|r
Nat King Cole|Mona Lisa|jazz|vocal|1|1950|r
Nat King Cole|Nature Boy|jazz|vocal|1|1948|m
Dean Martin|Everybody Loves Somebody|jazz|vocal|2|1964|r
Tony Bennett|I Left My Heart in San Francisco|jazz|vocal|2|1962|n
Tony Bennett|Rags to Riches|jazz|vocal|4|1953|j
Peggy Lee|Is That All There Is?|jazz|vocal|1|1969|m
Julie London|Cry Me a River|jazz|vocal|1|1955|m
Dinah Washington|What a Diff'rence a Day Makes|jazz|vocal|2|1959|r
Dinah Washington|Mad About the Boy|jazz|vocal|2|1952|r
Mel Tormé|Comin' Home Baby|jazz|vocal|4|1962|
Louis Armstrong|A Kiss to Build a Dream On|jazz|vocal|1|1951|r
Ella Fitzgerald & Louis Armstrong|They Can't Take That Away from Me|jazz|vocal|2|1956|r
John Coltrane & Johnny Hartman|My One and Only Love|jazz|vocal|1|1963|r
Diana Krall|Temptation|jazz|vocal|3|2004|
Diana Krall|'S Wonderful|jazz|vocal|2|2001|r
Norah Jones|Turn Me On|jazz|vocal|1|2002|r
Melody Gardot|Who Will Comfort Me|jazz|vocal|2|2009|
Gregory Porter|1960 What?|jazz|vocal|4|2010|
Michael Bublé|Everything|jazz|vocal|3|2007|r
Jamie Cullum|Twentysomething|jazz|vocal|3|2003|j
Jamie Cullum|Mind Trick|jazz|vocal|4|2005|
Madeleine Peyroux|J'ai deux amours|jazz|vocal|2|2004|n
Harry Connick Jr.|It Had to Be You|jazz|vocal|3|1989|r
Henri Salvador|Jardin d'hiver|jazz|vocal|1|2000|n
Nat King Cole|Smile|jazz|vocal|1|1954|m
Herbie Hancock|Rockit|jazz|moderne|5|1983|d
Miles Davis|Spanish Key|jazz|moderne|4|1970|i
Miles Davis|Tutu|jazz|moderne|3|1986|i
Miles Davis|It's About That Time|jazz|moderne|2|1969|i
John Coltrane|Mr. P.C.|jazz|moderne|5|1960|i
Chick Corea|Spain|jazz|moderne|4|1973|ij
Chick Corea|La Fiesta|jazz|moderne|4|1972|i
Weather Report|Teen Town|jazz|moderne|4|1977|i
Weather Report|A Remark You Made|jazz|moderne|1|1977|i
Jaco Pastorius|Portrait of Tracy|jazz|moderne|1|1976|i
Mahavishnu Orchestra|Birds of Fire|jazz|moderne|5|1973|i
Pat Metheny Group|Are You Going with Me?|jazz|moderne|2|1982|i
Pat Metheny|Bright Size Life|jazz|moderne|3|1976|i
Keith Jarrett|My Song|jazz|moderne|1|1978|i
George Benson|Breezin'|jazz|moderne|3|1976|i
Grover Washington Jr.|Mister Magic|jazz|moderne|3|1975|i
Grover Washington Jr.|Just the Two of Us|jazz|moderne|3|1980|r
Bob James|Nautilus|jazz|moderne|3|1974|i
Donald Byrd|Places and Spaces|jazz|moderne|3|1975|d
Roy Ayers|Everybody Loves the Sunshine|jazz|moderne|2|1976|n
Freddie Hubbard|Red Clay|jazz|moderne|3|1970|i
McCoy Tyner|Passion Dance|jazz|moderne|4|1967|i
Charles Mingus|Better Git It in Your Soul|jazz|moderne|5|1959|ij
Eric Dolphy|Hat and Beard|jazz|moderne|3|1964|i
Ornette Coleman|Lonely Woman|jazz|moderne|2|1959|im
Pharoah Sanders|The Creator Has a Master Plan|jazz|moderne|3|1969|
Alice Coltrane|Journey in Satchidananda|jazz|moderne|2|1971|i
Michel Petrucciani|Brazilian Like|jazz|moderne|3|1989|i
Esbjörn Svensson Trio|Dodge the Dodo|jazz|moderne|4|1999|i
Erik Truffaz|Bending New Corners|jazz|moderne|3|1999|i
St Germain|So Flute|jazz|moderne|4|2000|id
The Cinematic Orchestra|To Build a Home|jazz|moderne|1|2007|m
The Cinematic Orchestra|All That You Give|jazz|moderne|2|2002|
Kamasi Washington|The Rhythm Changes|jazz|moderne|3|2015|
Kamasi Washington|Street Fighter Mas|jazz|moderne|4|2018|i
Snarky Puppy|Shofukan|jazz|moderne|4|2014|i
Snarky Puppy|What About Me?|jazz|moderne|5|2014|i
GoGo Penguin|Murmuration|jazz|moderne|3|2015|i
BADBADNOTGOOD|Lavender|jazz|moderne|3|2016|i
Sons of Kemet|My Queen Is Harriet Tubman|jazz|moderne|4|2018|i
Spyro Gyra|Morning Dance|jazz|moderne|3|1979|ij
The Crusaders|Street Life|jazz|moderne|4|1979|d
Django Reinhardt|Swing 42|jazz|manouche|4|1941|ij
Django Reinhardt|Tears|jazz|manouche|2|1937|im
Django Reinhardt|Dinah|jazz|manouche|4|1934|ij
Yehudi Menuhin & Stéphane Grappelli|Jalousie|jazz|manouche|3|1973|ir
Charles Trenet|Je chante|jazz|manouche|4|1937|j
Charles Trenet|Boum !|jazz|manouche|4|1938|j
Charles Trenet|Ménilmontant|jazz|manouche|3|1938|n
Charles Trenet|Que reste-t-il de nos amours ?|jazz|manouche|1|1942|nm
Ray Ventura|Tout va très bien, Madame la Marquise|jazz|manouche|4|1935|j
Ray Ventura|Ça vaut mieux que d'attraper la scarlatine|jazz|manouche|4|1937|j
Ray Ventura|Qu'est-ce qu'on attend pour être heureux ?|jazz|manouche|4|1938|j
Johnny Hess|Je suis swing|jazz|manouche|5|1938|jd
Johnny Hess|Ils sont zazous|jazz|manouche|4|1942|jd
Jean Sablon|Vous qui passez sans me voir|jazz|manouche|1|1936|r
Pills et Tabet|Couchés dans le foin|jazz|manouche|4|1932|j
Thomas Dutronc|Comme un manouche sans guitare|jazz|manouche|3|2007|j
Zaz|Les Passants|jazz|manouche|4|2010|j
Zaz|Ni oui ni non|jazz|manouche|4|2010|
Johann Sebastian Bach|Prelude in C Major, BWV 846|classique|baroque|1|1722|i
Johann Sebastian Bach|Brandenburg Concerto No. 5: I. Allegro|classique|baroque|4|1721|i
Johann Sebastian Bach|Brandenburg Concerto No. 2: I. Allegro|classique|baroque|4|1721|ij
Johann Sebastian Bach|Orchestral Suite No. 2: Badinerie|classique|baroque|4|1739|ij
Johann Sebastian Bach|Sheep May Safely Graze|classique|baroque|1|1713|i
Johann Sebastian Bach|Partita No. 2 in D Minor: Chaconne|classique|baroque|3|1720|im
Antonio Vivaldi|The Four Seasons, Autumn: I. Allegro|classique|baroque|4|1725|ij
Antonio Vivaldi|The Four Seasons, Winter: II. Largo|classique|baroque|1|1725|i
Antonio Vivaldi|Trio Sonata in D Minor, Op. 1 No. 12 "La Follia"|classique|baroque|4|1705|i
Antonio Vivaldi|Violin Concerto in A Minor, Op. 3 No. 6: I. Allegro|classique|baroque|4|1711|i
Antonio Vivaldi|Concerto for 4 Violins in B Minor, Op. 3 No. 10|classique|baroque|4|1711|i
George Frideric Handel|Music for the Royal Fireworks: La Réjouissance|classique|baroque|4|1749|ij
George Frideric Handel|Passacaglia|classique|baroque|3|1720|i
George Frideric Handel|Water Music: Air|classique|baroque|2|1717|i
George Frideric Handel|The Harmonious Blacksmith|classique|baroque|3|1720|i
Henry Purcell|Abdelazer: Rondeau|classique|baroque|3|1695|i
Henry Purcell|Music for the Funeral of Queen Mary: March|classique|baroque|2|1695|im
Jean-Philippe Rameau|Le Rappel des oiseaux|classique|baroque|3|1724|i
Jean-Philippe Rameau|Tambourin|classique|baroque|4|1724|ij
Jean-Philippe Rameau|La Poule|classique|baroque|4|1728|i
Jean-Joseph Mouret|Rondeau|classique|baroque|4|1729|ij
Jeremiah Clarke|Prince of Denmark's March|classique|baroque|3|1700|ij
Arcangelo Corelli|Concerto Grosso Op. 6 No. 8 "Christmas Concerto"|classique|baroque|2|1714|i
Tomaso Albinoni|Oboe Concerto in D Minor, Op. 9 No. 2: II. Adagio|classique|baroque|1|1722|im
Alessandro Marcello|Oboe Concerto in D Minor: II. Adagio|classique|baroque|1|1717|im
François Couperin|Les Barricades mystérieuses|classique|baroque|2|1717|i
Louis-Claude Daquin|Le Coucou|classique|baroque|3|1735|ij
Jean-Baptiste Lully|Marche pour la cérémonie des Turcs|classique|baroque|4|1670|i
Claudio Monteverdi|L'Orfeo: Toccata|classique|baroque|4|1607|i
Marin Marais|Sonnerie de Sainte-Geneviève du Mont-de-Paris|classique|baroque|3|1723|i
Ludwig van Beethoven|Symphony No. 6 "Pastoral": I. Allegro ma non troppo|classique|romantique|3|1808|ij
Ludwig van Beethoven|Piano Sonata No. 8 "Pathétique": II. Adagio cantabile|classique|romantique|1|1798|i
Wolfgang Amadeus Mozart|Clarinet Concerto in A Major: II. Adagio|classique|romantique|1|1791|i
Wolfgang Amadeus Mozart|The Marriage of Figaro: Overture|classique|romantique|4|1786|ij
Frédéric Chopin|Fantaisie-Impromptu|classique|romantique|4|1834|i
Frédéric Chopin|Étude Op. 10 No. 3 "Tristesse"|classique|romantique|1|1832|im
Franz Schubert|Impromptu in G-flat Major, D. 899 No. 3|classique|romantique|1|1827|i
Edvard Grieg|Piano Concerto in A Minor: I. Allegro molto moderato|classique|romantique|4|1868|i
Felix Mendelssohn|Violin Concerto in E Minor: I. Allegro molto appassionato|classique|romantique|4|1844|i
Robert Schumann|Kinderszenen: Träumerei|classique|romantique|1|1838|i
Johannes Brahms|Symphony No. 3: III. Poco allegretto|classique|romantique|2|1883|im
Antonín Dvořák|Humoresque No. 7|classique|romantique|2|1894|i
Bedřich Smetana|Má vlast: Vltava|classique|romantique|3|1874|i
Modest Mussorgsky|Night on Bald Mountain|classique|romantique|5|1867|i
Nikolai Rimsky-Korsakov|Flight of the Bumblebee|classique|romantique|5|1900|i
Pietro Mascagni|Cavalleria rusticana: Intermezzo|classique|romantique|1|1890|im
Edward Elgar|Enigma Variations: Nimrod|classique|romantique|2|1899|i
Edward Elgar|Pomp and Circumstance March No. 1|classique|romantique|4|1901|ij
Joseph Haydn|Trumpet Concerto in E-flat Major: III. Allegro|classique|romantique|4|1796|ij
Georges Bizet|L'Arlésienne Suite No. 2: Farandole|classique|romantique|5|1872|i
Erik Satie|Gymnopédie No. 2|classique|moderne|1|1888|i
Erik Satie|Gnossienne No. 3|classique|moderne|1|1890|i
Erik Satie|Je te veux|classique|moderne|2|1897|ir
Claude Debussy|Prélude à l'après-midi d'un faune|classique|moderne|1|1894|i
Claude Debussy|La fille aux cheveux de lin|classique|moderne|1|1910|i
Claude Debussy|Golliwogg's Cakewalk|classique|moderne|3|1908|ij
Claude Debussy|La Mer: III. Dialogue du vent et de la mer|classique|moderne|4|1905|i
Maurice Ravel|Piano Concerto in G Major: II. Adagio assai|classique|moderne|1|1931|i
Maurice Ravel|Daphnis et Chloé: Lever du jour|classique|moderne|2|1912|i
Maurice Ravel|Jeux d'eau|classique|moderne|2|1901|i
Maurice Ravel|Ma mère l'Oye: Le jardin féerique|classique|moderne|1|1910|i
Philip Glass|Opening|classique|moderne|1|1982|i
Philip Glass|Mad Rush|classique|moderne|2|1979|i
Philip Glass|Truman Sleeps|classique|moderne|1|1998|i
Philip Glass|Metamorphosis Two|classique|moderne|1|1988|im
Arvo Pärt|Für Alina|classique|moderne|1|1976|i
Arvo Pärt|Fratres|classique|moderne|2|1977|im
Arvo Pärt|Tabula Rasa|classique|moderne|1|1977|im
Ludovico Einaudi|I Giorni|classique|moderne|1|2001|im
Ludovico Einaudi|Divenire|classique|moderne|2|2006|i
Ludovico Einaudi|Le Onde|classique|moderne|1|1996|i
Ludovico Einaudi|Primavera|classique|moderne|3|2006|i
Max Richter|November|classique|moderne|3|2002|im
Max Richter|Dream 3 (In the Midst of My Life)|classique|moderne|1|2015|i
Yann Tiersen|Porz Goret|classique|moderne|1|2016|im
Ólafur Arnalds|Near Light|classique|moderne|2|2011|i
Sergei Prokofiev|Lieutenant Kijé: Troika|classique|moderne|4|1934|ij
Aram Khachaturian|Sabre Dance|classique|moderne|5|1942|i
Aram Khachaturian|Spartacus: Adagio of Spartacus and Phrygia|classique|moderne|2|1956|ir
George Gershwin|Rhapsody in Blue|classique|moderne|4|1924|ij
Aaron Copland|Fanfare for the Common Man|classique|moderne|4|1942|i
Aaron Copland|Appalachian Spring|classique|moderne|2|1944|i
Igor Stravinsky|The Firebird: Infernal Dance|classique|moderne|5|1910|i
Joaquín Rodrigo|Concierto de Aranjuez: II. Adagio|classique|moderne|1|1939|im
Ralph Vaughan Williams|The Lark Ascending|classique|moderne|1|1914|i
Ralph Vaughan Williams|Fantasia on a Theme by Thomas Tallis|classique|moderne|1|1910|i
Steve Reich|Music for 18 Musicians|classique|moderne|3|1976|i
Michael Nyman|The Heart Asks Pleasure First|classique|moderne|3|1993|ir
Henryk Górecki|Symphony No. 3: II. Lento e largo|classique|moderne|1|1976|m
Béla Bartók|Romanian Folk Dances|classique|moderne|4|1915|i
Sergei Rachmaninoff|Vocalise|classique|moderne|1|1912|m
Giacomo Puccini|Madama Butterfly: Un bel dì vedremo|classique|lyrique|2|1904|m
Giacomo Puccini|Tosca: E lucevan le stelle|classique|lyrique|2|1900|m
Giacomo Puccini|Tosca: Vissi d'arte|classique|lyrique|2|1900|m
Giacomo Puccini|La Bohème: Quando m'en vo|classique|lyrique|2|1896|r
Giuseppe Verdi|Aida: Triumphal March|classique|lyrique|5|1871|
Giuseppe Verdi|La Traviata: Sempre libera|classique|lyrique|4|1853|
Giuseppe Verdi|Il trovatore: Anvil Chorus|classique|lyrique|4|1853|
Wolfgang Amadeus Mozart|The Marriage of Figaro: Voi che sapete|classique|lyrique|2|1786|r
Wolfgang Amadeus Mozart|Don Giovanni: Là ci darem la mano|classique|lyrique|2|1787|r
Wolfgang Amadeus Mozart|Così fan tutte: Soave sia il vento|classique|lyrique|1|1790|
Wolfgang Amadeus Mozart|Ave verum corpus|classique|lyrique|1|1791|
Georges Bizet|Les pêcheurs de perles: Au fond du temple saint|classique|lyrique|1|1863|r
Charles Gounod|Faust: Jewel Song|classique|lyrique|3|1859|j
Charles Gounod|Ave Maria|classique|lyrique|1|1853|
Camille Saint-Saëns|Samson et Dalila: Mon cœur s'ouvre à ta voix|classique|lyrique|1|1877|r
Jacques Offenbach|Les contes d'Hoffmann: Barcarolle|classique|lyrique|1|1881|r
Gaetano Donizetti|L'elisir d'amore: Una furtiva lagrima|classique|lyrique|1|1832|m
Ruggero Leoncavallo|Pagliacci: Vesti la giubba|classique|lyrique|3|1892|m
George Frideric Handel|Rinaldo: Lascia ch'io pianga|classique|lyrique|1|1711|m
George Frideric Handel|Serse: Ombra mai fù|classique|lyrique|1|1738|
George Frideric Handel|Zadok the Priest|classique|lyrique|5|1727|j
Johann Sebastian Bach|Wachet auf, ruft uns die Stimme|classique|lyrique|2|1731|
Johann Sebastian Bach|St Matthew Passion: Erbarme dich|classique|lyrique|1|1727|m
Antonio Vivaldi|Gloria in D Major, RV 589: Gloria in excelsis Deo|classique|lyrique|4|1715|j
Giovanni Battista Pergolesi|Stabat Mater: Stabat Mater dolorosa|classique|lyrique|1|1736|m
Gregorio Allegri|Miserere mei, Deus|classique|lyrique|1|1638|
Henry Purcell|King Arthur: What Power Art Thou|classique|lyrique|1|1691|m
Antonín Dvořák|Rusalka: Song to the Moon|classique|lyrique|1|1901|r
Alfredo Catalani|La Wally: Ebben? Ne andrò lontana|classique|lyrique|1|1892|m
Richard Wagner|Lohengrin: Bridal Chorus|classique|lyrique|2|1850|jr
Gabriel Fauré|Cantique de Jean Racine|classique|lyrique|1|1865|
Franz Lehár|Die lustige Witwe: Vilja-Lied|classique|lyrique|2|1905|r
George Gershwin|Porgy and Bess: Summertime|classique|lyrique|1|1935|
Jules Massenet|Werther: Pourquoi me réveiller|classique|lyrique|2|1892|m
Karl Jenkins|Adiemus|classique|lyrique|3|1995|
Karl Jenkins|The Armed Man: Benedictus|classique|lyrique|1|2000|
John Williams|Flying Theme|bo|films|4|1982|ij
John Williams|Across the Stars|bo|films|2|2002|ir
John Williams|Princess Leia's Theme|bo|films|2|1977|ir
Annie Lennox|Into the West|bo|films|1|2003|m
Bill Medley & Jennifer Warnes|(I've Had) The Time of My Life|bo|films|4|1987|jrnd
Bill Conti|Gonna Fly Now|bo|films|5|1976|jn
Kenny Loggins|Footloose|bo|films|5|1984|jnd
Kenny Loggins|Danger Zone|bo|films|5|1986|n
Irene Cara|Flashdance... What a Feeling|bo|films|4|1983|jnd
Ray Parker Jr.|Ghostbusters|bo|films|4|1984|jnd
Nino Rota|The Godfather Waltz|bo|films|1|1972|im
Maurice Jarre|Lara's Theme|bo|films|2|1965|irn
Henry Mancini|Moon River|bo|films|1|1961|rn
Henry Mancini|The Pink Panther Theme|bo|films|2|1963|i
Monty Norman|James Bond Theme|bo|films|4|1962|i
Adele|Skyfall|bo|films|3|2012|m
Shirley Bassey|Goldfinger|bo|films|3|1964|n
Alexandre Desplat|The Shape of Water|bo|films|1|2017|ir
Alexandre Desplat|Lily's Theme|bo|films|1|2010|m
Justin Hurwitz|Mia & Sebastian's Theme|bo|films|1|2016|ir
Ryan Gosling & Emma Stone|City of Stars|bo|films|1|2016|rm
Clint Mansell|Lux Aeterna|bo|films|3|2000|im
Trent Reznor & Atticus Ross|Hand Covers Bruise|bo|films|1|2010|im
Dario Marianelli|Dawn|bo|films|1|2005|ir
Danny Elfman|Ice Dance|bo|films|2|1990|i
Elton John|Can You Feel the Love Tonight|bo|films|2|1994|r
Phil Collins|You'll Be in My Heart|bo|films|2|1999|r
Idina Menzel|Let It Go|bo|films|4|2013|j
Lady Gaga & Bradley Cooper|Shallow|bo|films|3|2018|r
John Barry|The John Dunbar Theme|bo|films|1|1990|i
Gustavo Santaolalla|The Wings|bo|films|1|2005|im
The Rembrandts|I'll Be There for You|bo|series|4|1995|jn
David Arnold & Michael Price|The Game Is On|bo|series|4|2010|i
Ramin Djawadi|The Night King|bo|series|3|2019|i
Florence + The Machine|Jenny of Oldstones|bo|series|1|2019|m
Max Richter|The Departure|bo|series|1|2014|im
Hildur Guðnadóttir|Bridge of Death|bo|series|1|2019|im
Cristobal Tapia de Veer|Aloha!|bo|series|3|2021|
Mike Post|The Rockford Files|bo|series|3|1975|in
Lalo Schifrin|Mission: Impossible Theme|bo|series|4|1967|in
Henry Mancini|Peter Gunn|bo|series|4|1959|in
Neal Hefti|Batman Theme|bo|series|4|1966|jn
The Ventures|Hawaii Five-O|bo|series|4|1969|in
John Barry|The Persuaders|bo|series|2|1971|in
Bob James|Angela|bo|series|1|1978|in
Alabama 3|Woke Up This Morning|bo|series|3|1997|
Jace Everett|Bad Things|bo|series|3|2005|
Tom Waits|Way Down in the Hole|bo|series|3|1987|
RJD2|A Beautiful Mine|bo|series|3|2006|i
Daniel Licht|Blood Theme|bo|series|2|2006|i
The Handsome Family|Far from Any Road|bo|series|2|2003|m
Gary Portnoy|Where Everybody Knows Your Name|bo|series|2|1982|n
Lazlo Bane|Superman|bo|series|4|2000|jn
Phantom Planet|California|bo|series|4|2002|jn
Psapp|Cosy in the Rocket|bo|series|3|2004|j
Paula Cole|I Don't Want to Wait|bo|series|3|1996|n
Love Spit Love|How Soon Is Now?|bo|series|3|1994|n
Remy Zero|Save Me|bo|series|4|2001|n
Gavin DeGraw|I Don't Want to Be|bo|series|4|2003|n
They Might Be Giants|Boss of Me|bo|series|5|2000|jn
Angelo Badalamenti|Laura Palmer's Theme|bo|series|1|1990|im
Julee Cruise|Falling|bo|series|1|1989|m
Fever Ray|If I Had a Heart|bo|series|2|2008|m
Rodrigo Amarante|Tuyo|bo|series|2|2015|
Cecilia Krull|My Life Is Going On|bo|series|3|2017|
Labrinth|Still Don't Know My Name|bo|series|2|2019|m
Labrinth|Forever|bo|series|2|2019|m
The Scrantones|The Office Theme|bo|series|3|2005|ijn
Apparat|Goodbye|bo|series|2|2011|m
Michael Giacchino|Life and Death|bo|series|1|2005|im
Sonya Belousova & Giona Ostinelli|Toss a Coin to Your Witcher|bo|series|3|2019|j
Imagine Dragons & JID|Enemy|bo|series|4|2021|
Seatbelts|Tank!|bo|series|5|1998|i
Seatbelts|The Real Folk Blues|bo|series|3|1998|m
Curtis Stigers & The Forest Rangers|This Life|bo|series|3|2008|
The Brian Jonestown Massacre|Straight Up and Down|bo|series|3|1996|
Vonda Shepard|Searchin' My Soul|bo|series|3|1998|n
Koji Kondo|Gerudo Valley|bo|jeux|4|1998|ijn
Koji Kondo|Song of Storms|bo|jeux|3|1998|in
Nobuo Uematsu|Liberi Fatali|bo|jeux|5|1999|
Yasunori Mitsuda|Corridors of Time|bo|jeux|2|1995|in
Yasunori Mitsuda|Scars of Time|bo|jeux|4|1999|i
Hikaru Utada|Simple and Clean|bo|jeux|3|2002|n
Akira Yamaoka|Theme of Laura|bo|jeux|3|2001|m
Masato Nakamura|Green Hill Zone|bo|jeux|4|1991|ijn
David Wise|Aquatic Ambience|bo|jeux|1|1994|in
Keiichi Okabe|Weight of the World|bo|jeux|3|2017|m
Keiichi Okabe|Song of the Ancients|bo|jeux|2|2010|m
Bear McCreary|Memories of Mother|bo|jeux|1|2018|im
Mick Gordon|Rip & Tear|bo|jeux|5|2016|i
Mick Gordon|The Only Thing They Fear Is You|bo|jeux|5|2020|i
Jeremy Soule|From Past to Present|bo|jeux|1|2011|i
Jesper Kyd|Venice Rooftops|bo|jeux|3|2009|i
Gustavo Santaolalla|All Gone (No Escape)|bo|jeux|1|2013|im
Austin Wintory|Nascence|bo|jeux|1|2012|i
Austin Wintory|I Was Born for This|bo|jeux|3|2012|
Darren Korb|Good Riddance|bo|jeux|2|2020|m
Lena Raine|Pigstep|bo|jeux|4|2020|i
Lena Raine|First Steps|bo|jeux|2|2018|i
Lena Raine|Reach for the Summit|bo|jeux|4|2018|i
C418|Mice on Venus|bo|jeux|1|2011|in
C418|Minecraft|bo|jeux|1|2011|in
Toby Fox|Fallen Down|bo|jeux|1|2015|im
Toby Fox|Hopes and Dreams|bo|jeux|4|2015|ij
Toby Fox|Undertale|bo|jeux|2|2015|im
Christopher Larkin|Enter Hallownest|bo|jeux|1|2017|im
Christopher Larkin|City of Tears|bo|jeux|2|2017|im
Christopher Larkin|Dirtmouth|bo|jeux|1|2017|im
Yoko Shimomura|Destati|bo|jeux|4|2002|
Yoko Shimomura|Guile's Theme|bo|jeux|4|1991|in
Shoji Meguro|Mass Destruction|bo|jeux|4|2006|
Shoji Meguro|Beneath the Mask|bo|jeux|2|2016|
ConcernedApe|Stardew Valley Overture|bo|jeux|3|2016|ij
Jonathan Coulton|Still Alive|bo|jeux|2|2007|j
José González|Far Away|bo|jeux|2|2010|m
Mahito Yokota|Gusty Garden Galaxy|bo|jeux|4|2007|ij
Two Steps from Hell|Star Sky|bo|epique|4|2015|
Two Steps from Hell|Strength of a Thousand Men|bo|epique|5|2012|i
Two Steps from Hell|El Dorado|bo|epique|5|2010|i
Two Steps from Hell|Archangel|bo|epique|4|2011|i
Thomas Bergersen|Final Frontier|bo|epique|5|2014|i
Thomas Bergersen|Empire of Angels|bo|epique|5|2011|
Thomas Bergersen|Children of the Sun|bo|epique|4|2014|
Audiomachine|Blood and Stone|bo|epique|5|2012|i
Globus|Preliator|bo|epique|5|2006|
E.S. Posthumus|Unstoppable|bo|epique|5|2008|i
E.S. Posthumus|Nara|bo|epique|4|2001|i
Hans Zimmer|Mombasa|bo|epique|5|2010|i
Hans Zimmer|The Battle|bo|epique|5|2000|i
Hans Zimmer|Chevaliers de Sangreal|bo|epique|4|2006|i
Hans Zimmer|Flight|bo|epique|4|2013|i
Hans Zimmer & Junkie XL|Is She with You?|bo|epique|5|2016|i
Hans Zimmer & James Newton Howard|Molossus|bo|epique|5|2005|i
John Williams|Battle of the Heroes|bo|epique|5|2005|
John Williams|Throne Room and Finale|bo|epique|4|1977|ij
Basil Poledouris|Anvil of Crom|bo|epique|4|1982|i
Alan Silvestri|Portals|bo|epique|4|2019|i
Ramin Djawadi|Pacific Rim|bo|epique|5|2013|i
Junkie XL|Brothers in Arms|bo|epique|5|2015|i
John Powell|Test Drive|bo|epique|4|2010|ij
John Powell|Forbidden Friendship|bo|epique|2|2010|i
John Powell|Romantic Flight|bo|epique|3|2010|ir
Michael Giacchino|Enterprising Young Men|bo|epique|4|2009|i
Nujabes|Lady Brown|lofi|lofi|2|2003|
Nujabes|Modal Soul|lofi|lofi|2|2005|i
Nujabes|Ordinary Joe|lofi|lofi|2|2005|
J Dilla|Don't Cry|lofi|lofi|2|2006|im
J Dilla|Last Donut of the Night|lofi|lofi|2|2006|i
J Dilla|Two Can Win|lofi|lofi|3|2006|i
J Dilla|Lightworks|lofi|lofi|3|2006|i
Slum Village|Fall in Love|lofi|lofi|2|2000|r
Madvillain|Accordion|lofi|lofi|2|2004|
Madvillain|All Caps|lofi|lofi|3|2004|
Pete Rock & CL Smooth|They Reminisce Over You (T.R.O.Y.)|lofi|lofi|3|1992|n
Guru|Loungin'|lofi|lofi|2|1993|n
De La Soul|Eye Know|lofi|lofi|3|1989|rn
Us3|Cantaloop (Flip Fantasia)|lofi|lofi|4|1992|jd
RJD2|Ghostwriter|lofi|lofi|3|2002|
ProleteR|April Showers|lofi|lofi|3|2012|i
Kudasaibeats|The Girl I Haven't Met|lofi|lofi|1|2017|im
In Love with a Ghost|We've Never Met but Can We Have a Coffee or Something|lofi|lofi|2|2016|ij
Powfu|Death Bed (Coffee for Your Head)|lofi|lofi|2|2019|m
Massive Attack|Angel|lofi|downtempo|3|1998|
Massive Attack|Protection|lofi|downtempo|2|1994|m
Massive Attack|Safe from Harm|lofi|downtempo|3|1991|
Massive Attack|Karmacoma|lofi|downtempo|2|1994|
Portishead|Roads|lofi|downtempo|1|1994|m
Portishead|Wandering Star|lofi|downtempo|2|1994|m
Portishead|Only You|lofi|downtempo|2|1997|m
Portishead|Machine Gun|lofi|downtempo|3|2008|
Tricky|Hell Is Round the Corner|lofi|downtempo|2|1995|m
Zero 7|Destiny|lofi|downtempo|2|2001|r
Zero 7|Somersault|lofi|downtempo|2|2004|r
Zero 7|Distractions|lofi|downtempo|1|2001|m
Thievery Corporation|The Richest Man in Babylon|lofi|downtempo|3|2002|
Thievery Corporation|The Heart's a Lonely Hunter|lofi|downtempo|2|2002|m
Morcheeba|Rome Wasn't Built in a Day|lofi|downtempo|3|2000|j
Morcheeba|Trigger Hippie|lofi|downtempo|3|1996|
Morcheeba|Part of the Process|lofi|downtempo|2|1998|
Hooverphonic|2 Wicky|lofi|downtempo|3|1996|
Moby|Why Does My Heart Feel So Bad?|lofi|downtempo|2|1999|m
Air|Playground Love|lofi|downtempo|1|2000|rm
Air|All I Need|lofi|downtempo|2|1998|r
Air|Cherry Blossom Girl|lofi|downtempo|2|2004|r
Lamb|Gabriel|lofi|downtempo|2|2001|m
Sneaker Pimps|6 Underground|lofi|downtempo|3|1996|n
Mono|Life in Mono|lofi|downtempo|2|1996|mn
Archive|Again|lofi|downtempo|2|2002|m
DJ Shadow|Midnight in a Perfect World|lofi|downtempo|2|1996|m
UNKLE|Rabbit in Your Headlights|lofi|downtempo|3|1998|m
Nightmares on Wax|You Wish|lofi|downtempo|2|2006|
Groove Armada|At the River|lofi|downtempo|1|1997|
Lemon Jelly|Nice Weather for Ducks|lofi|downtempo|2|2002|j
Gotan Project|Santa María (Del Buen Ayre)|lofi|downtempo|3|2001|d
Goldfrapp|Lovely Head|lofi|downtempo|2|2000|m
Bonobo|Days to Come|lofi|downtempo|2|2006|
Little Dragon|Twice|lofi|downtempo|1|2007|m
Smoke City|Underwater Love|lofi|downtempo|2|1997|r
Télépopmusik|Breathe|lofi|downtempo|2|2001|
The Cinematic Orchestra|Arrival of the Birds|lofi|downtempo|1|2008|i
Wax Tailor|Que sera|lofi|downtempo|3|2005|
James Blake|Retrograde|lofi|downtempo|2|2013|m
Bonobo|First Fires|lofi|chillelectro|2|2013|
Bonobo|Break Apart|lofi|chillelectro|1|2017|m
Bonobo|Flashlight|lofi|chillelectro|3|2014|i
Tycho|Montana|lofi|chillelectro|3|2014|i
Tycho|Epoch|lofi|chillelectro|3|2016|i
Tycho|Hours|lofi|chillelectro|2|2011|i
ODESZA|Sun Models|lofi|chillelectro|3|2014|
ODESZA|Bloom|lofi|chillelectro|3|2014|i
ODESZA|Line of Sight|lofi|chillelectro|3|2017|
ODESZA|How Did I Get Here|lofi|chillelectro|2|2012|i
Four Tet|Two Thousand and Seventeen|lofi|chillelectro|2|2017|in
Maribou State|Turnmills|lofi|chillelectro|3|2018|i
Röyksopp|Remind Me|lofi|chillelectro|3|2001|
Gold Panda|You|lofi|chillelectro|3|2010|i
Bibio|Lovers' Carvings|lofi|chillelectro|2|2009|n
Chet Faker|Gold|lofi|chillelectro|2|2014|r
Burial|Archangel|lofi|chillelectro|3|2007|m
Caribou|Odessa|lofi|chillelectro|4|2010|d
Klangkarussell|Sonnentanz|lofi|chillelectro|3|2012|id
Red Velvet|Red Flavor|asie|kpop|4|2017|j
EXO|Love Shot|asie|kpop|4|2018|d
ITZY|Dalla Dalla|asie|kpop|5|2019|d
ITZY|WANNABE|asie|kpop|5|2020|d
(G)I-DLE|Queencard|asie|kpop|4|2023|dj
aespa|Spicy|asie|kpop|5|2023|dj
aespa|Whiplash|asie|kpop|4|2024|d
IVE|After LIKE|asie|kpop|4|2022|d
IVE|Eleven|asie|kpop|4|2021|
NewJeans|OMG|asie|kpop|3|2023|
MAMAMOO|HIP|asie|kpop|5|2019|d
Wonder Girls|Nobody|asie|kpop|4|2008|dn
Wonder Girls|Tell Me|asie|kpop|5|2007|dn
Super Junior|Sorry, Sorry|asie|kpop|5|2009|d
BIGBANG|Haru Haru|asie|kpop|3|2008|m
IU|Palette|asie|kpop|2|2017|
Zico|Any Song|asie|kpop|4|2020|dj
Sunmi|Gashina|asie|kpop|4|2017|d
SISTAR|Touch My Body|asie|kpop|4|2014|dj
JENNIE|SOLO|asie|kpop|4|2018|d
LISA|MONEY|asie|kpop|5|2021|d
Girls' Generation|I Got a Boy|asie|kpop|5|2013|
HyunA|Bubble Pop!|asie|kpop|5|2011|dj
LE SSERAFIM|FEARLESS|asie|kpop|4|2022|
Hikaru Utada|Automatic|asie|jpop|2|1998|r
Hikaru Utada|Traveling|asie|jpop|4|2001|dj
Ayumi Hamasaki|SEASONS|asie|jpop|2|2000|m
Ayumi Hamasaki|Boys & Girls|asie|jpop|4|1999|n
Namie Amuro|Can You Celebrate?|asie|jpop|2|1997|rn
Namie Amuro|Don't wanna cry|asie|jpop|4|1996|dn
Mr.Children|Tomorrow never knows|asie|jpop|3|1994|mn
Mr.Children|innocent world|asie|jpop|3|1994|n
Mr.Children|Shirushi|asie|jpop|2|2006|r
SMAP|Sekai ni Hitotsu Dake no Hana|asie|jpop|3|2003|jn
B'z|ultra soul|asie|jpop|5|2001|
DREAMS COME TRUE|LOVE LOVE LOVE|asie|jpop|2|1995|rn
Southern All Stars|TSUNAMI|asie|jpop|2|2000|rm
Southern All Stars|Itoshi no Ellie|asie|jpop|2|1979|rn
L'Arc-en-Ciel|HONEY|asie|jpop|5|1998|n
DAOKO × Kenshi Yonezu|Uchiage Hanabi|asie|jpop|3|2017|mn
Kenshi Yonezu|LOSER|asie|jpop|4|2016|
Kenshi Yonezu|Flamingo|asie|jpop|3|2018|
Kenshi Yonezu|Uma to Shika|asie|jpop|3|2022|
YOASOBI|Tabun|asie|jpop|3|2020|m
Official HIGE DANdism|I LOVE...|asie|jpop|3|2020|r
King Gnu|Teenager Forever|asie|jpop|4|2019|
Fujii Kaze|Kirari|asie|jpop|4|2021|jd
Fujii Kaze|Nan-Nan|asie|jpop|3|2019|
Aimyon|Haru no Hi|asie|jpop|3|2019|r
Aimyon|Ai wo Tsutaetaitoka|asie|jpop|3|2017|
back number|Happy End|asie|jpop|2|2016|m
back number|Suiheisen|asie|jpop|2|2020|m
Vaundy|Odoriko|asie|jpop|3|2021|
Vaundy|Tokyo Flash|asie|jpop|3|2019|
Ado|Show|asie|jpop|5|2023|
Yuuri|Dry Flower|asie|jpop|2|2020|m
Yuuri|Betelgeuse|asie|jpop|2|2021|r
Perfume|Chocolate Disco|asie|jpop|5|2007|dj
Kyary Pamyu Pamyu|Fashion Monster|asie|jpop|5|2012|j
Mrs. GREEN APPLE|Dance Hall|asie|jpop|5|2022|dj
Gen Hoshino|Koi|asie|jpop|4|2016|dj
Gen Hoshino|SUN|asie|jpop|4|2015|dj
Sheena Ringo|Marunouchi Sadistic|asie|jpop|3|1999|
Tokyo Jihen|Gunjou Biyori|asie|jpop|5|2004|
Kyu Sakamoto|Sukiyaki|asie|jpop|2|1961|nm
YUI|Good-bye days|asie|jpop|2|2006|m
Superfly|Ai o Komete Hanataba o|asie|jpop|3|2008|r
SEKAI NO OWARI|Dragon Night|asie|jpop|4|2014|d
SEKAI NO OWARI|RPG|asie|jpop|4|2013|j
Yorushika|Tada Kimi ni Hare|asie|jpop|3|2018|m
Yorushika|Hitchcock|asie|jpop|3|2018|m
ZUTOMAYO|Byoushinwo Kamu|asie|jpop|4|2018|
tuki.|Bansanka|asie|jpop|2|2023|m
imase|NIGHT DANCER|asie|jpop|3|2022|d
Masaki Suda|Machigai Sagashi|asie|jpop|2|2019|m
Spitz|Cherry|asie|jpop|3|1996|n
AKB48|Koisuru Fortune Cookie|asie|jpop|4|2013|dj
Arashi|Love so sweet|asie|jpop|4|2007|j
Every Little Thing|Time goes by|asie|jpop|2|1998|mn
globe|DEPARTURES|asie|jpop|3|1996|mn
Ken Hirai|Hitomi wo Tojite|asie|jpop|1|2004|rm
Kobukuro|Sakura|asie|jpop|2|2005|m
Ikimonogakari|Arigatou|asie|jpop|2|2010|
ATARASHII GAKKO!|Otona Blue|asie|jpop|4|2020|d
natori|Overdose|asie|jpop|4|2022|d
Eve|Dramaturgy|asie|jpop|4|2017|
Tatsuya Kitani|Ao no Sumika|asie|anime|4|2023|n
King Gnu|SPECIALZ|asie|anime|5|2023|
King Gnu|Ichizu|asie|anime|5|2021|
Official HIGE DANdism|Cry Baby|asie|anime|5|2021|
Official HIGE DANdism|Mixed Nuts|asie|anime|5|2022|j
YOASOBI|Kaibutsu|asie|anime|5|2021|
YOASOBI|Yuusha|asie|anime|4|2023|
Creepy Nuts|Otonoke|asie|anime|5|2024|d
Mrs. GREEN APPLE|Inferno|asie|anime|5|2019|
Mrs. GREEN APPLE|Lilac|asie|anime|4|2024|j
Kenshi Yonezu|IRIS OUT|asie|anime|5|2025|
Aimer|Brave Shine|asie|anime|5|2015|
LiSA|crossing field|asie|anime|5|2012|n
LiSA|Rising Hope|asie|anime|5|2014|
MAN WITH A MISSION × milet|Kizuna no Kiseki|asie|anime|4|2023|
Linked Horizon|Shinzou wo Sasageyo!|asie|anime|5|2017|
SiM|The Rumbling|asie|anime|5|2022|
High and Mighty Color|Ichirin no Hana|asie|anime|5|2005|n
FLOW|Sign|asie|anime|5|2009|n
FLOW|COLORS|asie|anime|5|2006|n
Ikimonogakari|Hotaru no Hikari|asie|anime|4|2009|n
Asian Kung-Fu Generation|Rewrite|asie|anime|5|2004|n
Porno Graffitti|Melissa|asie|anime|5|2003|n
Porno Graffitti|THE DAY|asie|anime|5|2016|
L'Arc-en-Ciel|READY STEADY GO|asie|anime|5|2004|n
L'Arc-en-Ciel|Driver's High|asie|anime|5|1999|n
YUI|again|asie|anime|4|2009|n
Kalafina|Magia|asie|anime|4|2011|m
ClariS|Connect|asie|anime|4|2011|n
supercell|My Dearest|asie|anime|4|2011|
supercell|Kimi no Shiranai Monogatari|asie|anime|3|2009|mn
TM NETWORK|Get Wild|asie|anime|4|1987|n
Do As Infinity|Fukai Mori|asie|anime|2|2001|mn
RADWIMPS|Nandemonaiya|asie|anime|2|2016|m
RADWIMPS|Grand Escape|asie|anime|3|2019|
Ado|Tot Musica|asie|anime|5|2022|
UVERworld|D-tecnoLife|asie|anime|5|2005|n
SPYAIR|Imagination|asie|anime|5|2014|
BURNOUT SYNDROMES|Hikari Are|asie|anime|5|2016|
Maaya Sakamoto|Yakusoku wa Iranai|asie|anime|3|1996|n
Azumi Inoue|Sanpo|asie|anime|3|1988|jn
Akeboshi|Wind|asie|anime|2|2002|n
Shoko Nakagawa|Sorairo Days|asie|anime|5|2007|n
UNISON SQUARE GARDEN|Sugar Song to Bitter Step|asie|anime|5|2015|d
TK from Ling tosite sigure|unravel|asie|anime|5|2014|m
Aqua Timez|ALONES|asie|anime|4|2009|n
the pillows|Ride on Shooting Star|asie|anime|5|2000|n
Lia|Tori no Uta|asie|anime|3|2004|mn
Isao Sasaki|Uchuu Senkan Yamato|asie|anime|4|1974|n
Hironobu Kageyama|CHA-LA HEAD-CHA-LA|asie|anime|5|1989|jn
Hironobu Kageyama|WE GOTTA POWER|asie|anime|5|1993|n
FIELD OF VIEW|Kimi ga Inai Natsu|asie|anime|3|1997|mn
Mai Kuraki|Secret of my heart|asie|anime|3|2000|rn
Megumi Hayashibara|Give a reason|asie|anime|4|1996|n
ZARD|My Friend|asie|anime|3|1996|n
WANDS|Sekai ga Owaru made wa|asie|anime|3|1994|mn
BAAD|Kimi ga Suki da to Sakebitai|asie|anime|5|1993|n
Hikaru Utada|Beautiful World|asie|anime|3|2007|
BUMP OF CHICKEN|Hello,world!|asie|anime|5|2015|
ALI|Lost In Paradise|asie|anime|4|2020|d
Tatsuro Yamashita|Christmas Eve|asie|citypop|2|1983|rn
Tatsuro Yamashita|Bomber|asie|citypop|4|1978|d
Mariya Takeuchi|Fushigi na Peach Pie|asie|citypop|4|1980|jn
Mariya Takeuchi|Single Again|asie|citypop|2|1989|mn
Anri|Cat's Eye|asie|citypop|4|1983|dn
Anri|Windy Summer|asie|citypop|3|1983|n
Anri|Kanashimi ga Tomaranai|asie|citypop|3|1983|mn
Junko Ohashi|Telephone Number|asie|citypop|4|1984|dn
Taeko Ohnuki|Tokai|asie|citypop|3|1977|n
Taeko Ohnuki|Summer Connection|asie|citypop|3|1977|jn
Takako Mamiya|Love Trip|asie|citypop|3|1982|n
Eiichi Ohtaki|Kimi wa Tennen-shoku|asie|citypop|3|1981|rn
Eiichi Ohtaki|FUN×4|asie|citypop|4|1981|jn
Haruomi Hosono|Sports Men|asie|citypop|3|1982|n
Yumi Matsutoya|Rouge no Dengon|asie|citypop|4|1975|jn
Yumi Matsutoya|Koibito ga Santa Claus|asie|citypop|4|1980|jn
Yumi Matsutoya|Yasashisa ni Tsutsumareta nara|asie|citypop|2|1974|n
Yumi Matsutoya|Destiny|asie|citypop|4|1979|n
Toshiki Kadomatsu|Tokyo Tower|asie|citypop|4|1985|dn
Yasuha|Flyday Chinatown|asie|citypop|4|1981|dn
Kingo Hamada|Midnight Cruisin'|asie|citypop|2|1982|n
Junko Yagami|Mizuiro no Ame|asie|citypop|3|1983|mn
Junko Yagami|Purple Town|asie|citypop|4|1980|dn
Kaoru Akimoto|Dress Down|asie|citypop|4|1986|dn
1986 Omega Tribe|Kimi wa 1000%|asie|citypop|4|1986|jn
Kiyotaka Sugiyama & Omega Tribe|Futari no Natsu Monogatari|asie|citypop|4|1985|rn
Kiyotaka Sugiyama & Omega Tribe|Riverside Hotel|asie|citypop|3|1985|n
Kiyotaka Sugiyama & Omega Tribe|Summer Suspicion|asie|citypop|3|1983|n
Carlos Toshiki & Omega Tribe|Aquamarine no Mama de Ite|asie|citypop|3|1988|rn
Meiko Nakahara|Kimi-tachi Kiwi Papaya Mango da ne|asie|citypop|5|1984|dj
Masayoshi Takanaka|Blue Lagoon|asie|citypop|4|1979|i
T-SQUARE|TRUTH|asie|citypop|5|1987|i
Akira Terao|Ruby no Yubiwa|asie|citypop|2|1981|n
Ginji Ito|Baby Blue|asie|citypop|3|1982|n
Sugar Babe|DOWN TOWN|asie|citypop|4|1975|jn
Makoto Matsushita|Love Was Really Gone|asie|citypop|3|1981|n
Miki Matsubara|Neat na Gogo Sanji|asie|citypop|3|1980|n
Seiko Matsuda|Sweet Memories|asie|citypop|1|1983|rn
Suchmos|STAY TUNE|asie|citypop|3|2016|
Suchmos|MINT|asie|citypop|3|2016|
YUKIKA|NEON|asie|citypop|3|2019|n
cero|Summer Soul|asie|citypop|3|2015|
KIRINJI|killer tune kills me|asie|citypop|3|2021|
Burna Boy|Anybody|monde|afro|4|2019|d
Wizkid|Come Closer|monde|afro|3|2017|r
Wizkid|Joro|monde|afro|3|2019|r
Davido|IF|monde|afro|3|2017|r
Davido|UNAVAILABLE|monde|afro|4|2023|d
Tems|Me & U|monde|afro|3|2023|
Rema|Dumebi|monde|afro|4|2019|d
Asake|Sungba|monde|afro|4|2022|d
Ayra Starr|Sability|monde|afro|4|2023|
Fireboy DML|Bandana|monde|afro|4|2022|d
Omah Lay|Godly|monde|afro|3|2020|
Kizz Daniel|Buga|monde|afro|4|2022|dj
P-Square|Personally|monde|afro|5|2011|d
2Baba|African Queen|monde|afro|3|2004|rn
D'banj|Oliver Twist|monde|afro|5|2011|dj
Mr Eazi|Leg Over|monde|afro|3|2016|d
Yemi Alade|Johnny|monde|afro|4|2014|dj
Fuse ODG|Antenna|monde|afro|5|2013|dj
Osibisa|Sunshine Day|monde|afro|4|1976|jn
Prince Nico Mbarga|Sweet Mother|monde|afro|4|1976|jn
Manu Dibango|Soul Makossa|monde|afro|5|1972|dn
Fela Kuti|Lady|monde|afro|4|1972|d
King Sunny Adé|Ja Funmi|monde|afro|3|1982|
Black Sherif|Kwaku the Traveller|monde|afro|3|2022|
Tiwa Savage|All Over|monde|afro|4|2017|d
Flavour|Ada Ada|monde|afro|4|2014|dj
Tekno|Pana|monde|afro|4|2016|dr
Runtown|Mad Over You|monde|afro|3|2016|r
Awilo Longomba|Coupé Bibamba|monde|afro|5|1998|dj
Cheb Mami|Parisien du Nord|monde|orient|4|1998|
Amr Diab|Nour El Ein|monde|orient|5|1996|dj
Amr Diab|Leily Nahary|monde|orient|4|2004|d
Nancy Ajram|Akhasmak Ah|monde|orient|4|2003|d
Nancy Ajram|Ya Tabtab Wa Dalla'|monde|orient|3|2006|r
Haifa Wehbe|Boos El Wawa|monde|orient|4|2006|d
Elissa|Aa Bali Habibi|monde|orient|3|2002|r
Fairuz|Kifak Inta|monde|orient|2|1991|m
Oum Kalthoum|Alf Leila wa Leila|monde|orient|2|1969|r
Chaba Fadela & Cheb Sahraoui|N'sel Fik|monde|orient|4|1983|r
Tarkan|Kuzu Kuzu|monde|orient|5|2001|d
Tarkan|Dudu|monde|orient|5|2003|d
Tarkan|Şıkıdım|monde|orient|5|1994|d
Sezen Aksu|Gülümse|monde|orient|2|1991|m
Sezen Aksu|Hadi Bakalım|monde|orient|4|1991|j
Barış Manço|Dağlar Dağlar|monde|orient|3|1970|n
Ajda Pekkan|Bambaşka Biri|monde|orient|3|1975|n
Sertab Erener|Everyway That I Can|monde|orient|5|2003|d
Mustafa Sandal|İsyankar|monde|orient|4|1998|
Kenan Doğulu|Shake It Up Şekerim|monde|orient|5|2007|dj
Simge|Aşkın Olayım|monde|orient|4|2017|dr
Hadise|Düm Tek Tek|monde|orient|5|2009|d
Edis|Çok Çok|monde|orient|4|2016|d
Gülşen|Bangır Bangır|monde|orient|5|2015|d
Saad Lamjarred|Lm3allem|monde|orient|5|2015|d
Dalida|Salma Ya Salama|monde|orient|4|1977|jn
Dalida|Helwa Ya Baladi|monde|orient|2|1979|n
Soolking|Liberté|monde|orient|4|2019|
Balti|Ya Lili|monde|orient|3|2016|m
João Gilberto|Desafinado|monde|bresil|2|1959|n
Stan Getz & João Gilberto|Corcovado|monde|bresil|1|1964|r
Jorge Ben Jor|País Tropical|monde|bresil|5|1969|dj
Jorge Ben Jor|Ponta de Lança Africano (Umbabarauma)|monde|bresil|5|1976|d
Tim Maia|Azul da Cor do Mar|monde|bresil|2|1970|rm
Tim Maia|Gostava Tanto de Você|monde|bresil|2|1973|rm
Tim Maia|Do Leme ao Pontal|monde|bresil|5|1986|dj
Caetano Veloso|Leãozinho|monde|bresil|2|1977|j
Caetano Veloso|Você É Linda|monde|bresil|2|1983|r
Caetano Veloso|Tropicália|monde|bresil|3|1968|
Gilberto Gil|Andar com Fé|monde|bresil|4|1982|j
Gilberto Gil|Expresso 2222|monde|bresil|4|1972|j
Elis Regina|Como Nossos Pais|monde|bresil|3|1976|m
Elis Regina|O Bêbado e a Equilibrista|monde|bresil|2|1979|m
Chico Buarque|A Banda|monde|bresil|3|1966|jn
Milton Nascimento|Travessia|monde|bresil|2|1967|m
Milton Nascimento|Maria Maria|monde|bresil|3|1978|
Marisa Monte|Amor I Love You|monde|bresil|2|2000|r
Marisa Monte|Beija Eu|monde|bresil|3|1991|r
Djavan|Oceano|monde|bresil|2|1989|r
Djavan|Sina|monde|bresil|3|1982|
Gal Costa|Baby|monde|bresil|2|1969|rn
Gal Costa|Festa do Interior|monde|bresil|5|1981|dj
Os Mutantes|Panis et Circenses|monde|bresil|3|1968|
Cartola|O Mundo É um Moinho|monde|bresil|1|1976|m
Cartola|As Rosas Não Falam|monde|bresil|1|1976|m
Beth Carvalho|Vou Festejar|monde|bresil|5|1978|dj
Zeca Pagodinho|Deixa a Vida Me Levar|monde|bresil|4|2002|j
Clara Nunes|O Mar Serenou|monde|bresil|3|1975|
Martinho da Vila|Canta, Canta, Minha Gente|monde|bresil|4|1974|j
Alcione|Não Deixe o Samba Morrer|monde|bresil|3|1975|n
Paulinho da Viola|Foi um Rio que Passou em Minha Vida|monde|bresil|3|1970|n
Baden Powell & Vinicius de Moraes|Canto de Ossanha|monde|bresil|3|1966|
Luiz Gonzaga|Asa Branca|monde|bresil|3|1947|nm
Secos & Molhados|Sangue Latino|monde|bresil|3|1973|
Rita Lee|Lança Perfume|monde|bresil|5|1980|dj
Rita Lee|Mania de Você|monde|bresil|3|1979|r
Legião Urbana|Tempo Perdido|monde|bresil|4|1986|mn
Os Paralamas do Sucesso|Meu Erro|monde|bresil|4|1984|n
Cazuza|Exagerado|monde|bresil|4|1985|
Skank|Garota Nacional|monde|bresil|5|1996|dj
Daniela Mercury|O Canto da Cidade|monde|bresil|5|1992|dj
Anitta|Show das Poderosas|monde|bresil|5|2013|d
Anitta|Vai Malandra|monde|bresil|5|2017|d
Pabllo Vittar|K.O.|monde|bresil|5|2017|d
Marília Mendonça|Infiel|monde|bresil|3|2016|m
Tribalistas|Já Sei Namorar|monde|bresil|3|2002|j
Tribalistas|Velha Infância|monde|bresil|2|2002|r
Sérgio Mendes|Magalenha|monde|bresil|5|1992|dj
Marcos Valle|Samba de Verão|monde|bresil|3|1964|jn
Wilson Simonal|Nem Vem que Não Tem|monde|bresil|4|1967|jd
Lulu Santos|Como uma Onda|monde|bresil|3|1983|n
Kid Abelha|Como Eu Quero|monde|bresil|3|1984|rn
Arijit Singh|Channa Mereya|monde|inde|2|2016|m
Arijit Singh|Ae Dil Hai Mushkil|monde|inde|2|2016|rm
Shreya Ghoshal|Chikni Chameli|monde|inde|5|2012|d
Shreya Ghoshal|Ghoomar|monde|inde|3|2018|
Sunidhi Chauhan|Sheila Ki Jawani|monde|inde|5|2010|d
Sunidhi Chauhan|Dhoom Machale|monde|inde|5|2004|d
Sonu Nigam|Kal Ho Naa Ho|monde|inde|2|2003|m
Sonu Nigam|Abhi Mujh Mein Kahin|monde|inde|1|2012|m
Kumar Sanu|Tujhe Dekha To|monde|inde|2|1995|rn
Kumar Sanu|Ek Ladki Ko Dekha|monde|inde|2|1994|rn
Udit Narayan|Pehla Nasha|monde|inde|2|1992|rn
Udit Narayan|Papa Kehte Hain|monde|inde|3|1988|n
Lata Mangeshkar|Ajeeb Dastan Hai Yeh|monde|inde|1|1960|rn
Lata Mangeshkar|Pyar Kiya To Darna Kya|monde|inde|3|1960|rn
Kishore Kumar|Pal Pal Dil Ke Paas|monde|inde|2|1973|rn
Kishore Kumar|Roop Tera Mastana|monde|inde|2|1969|rn
Kishore Kumar|Ek Ladki Bheegi Bhagi Si|monde|inde|4|1958|jn
Mohammed Rafi|Kya Hua Tera Wada|monde|inde|2|1977|mn
Mohammed Rafi|Baharon Phool Barsao|monde|inde|2|1966|rn
Mohammed Rafi|Chaudhvin Ka Chand|monde|inde|1|1960|rn
R. D. Burman|Mehbooba Mehbooba|monde|inde|4|1975|dn
Asha Bhosle|Piya Tu Ab To Aaja|monde|inde|5|1971|dn
Asha Bhosle|In Aankhon Ki Masti|monde|inde|1|1981|rn
A. R. Rahman|Dil Se Re|monde|inde|4|1998|
A. R. Rahman|Kun Faya Kun|monde|inde|2|2011|
Rahat Fateh Ali Khan|Tere Mast Mast Do Nain|monde|inde|3|2010|r
Rahat Fateh Ali Khan|Zaroori Tha|monde|inde|2|2014|rm
Atif Aslam|Tera Hone Laga Hoon|monde|inde|3|2009|r
Atif Aslam|Jeena Jeena|monde|inde|2|2015|r
Atif Aslam|Pehli Nazar Mein|monde|inde|2|2008|r
KK|Pyaar Ke Pal|monde|inde|3|1999|n
KK|Khuda Jaane|monde|inde|2|2008|r
Mohit Chauhan|Tum Se Hi|monde|inde|2|2007|r
Mohit Chauhan|Masakali|monde|inde|3|2009|j
Neha Kakkar|Dilbar|monde|inde|5|2018|d
Badshah|DJ Waley Babu|monde|inde|5|2015|d
Yo Yo Honey Singh|Blue Eyes|monde|inde|5|2013|d
Yo Yo Honey Singh|Brown Rang|monde|inde|4|2011|d
Guru Randhawa|Lahore|monde|inde|4|2017|d
Guru Randhawa|High Rated Gabru|monde|inde|5|2017|d
Diljit Dosanjh|Do You Know|monde|inde|3|2016|r
Diljit Dosanjh|G.O.A.T.|monde|inde|4|2020|
AP Dhillon|Excuses|monde|inde|3|2020|r
Karan Aujla|Softly|monde|inde|4|2023|d
Karan Aujla|Tauba Tauba|monde|inde|5|2024|d
Shubh|Still Rollin|monde|inde|4|2023|
Sidhu Moose Wala|So High|monde|inde|4|2017|
B Praak|Teri Mitti|monde|inde|2|2019|m
Jubin Nautiyal|Raataan Lambiyan|monde|inde|2|2021|r
Anuv Jain|Husn|monde|inde|1|2023|m
Prateek Kuhad|cold/mess|monde|inde|1|2018|m
Lucky Ali|O Sanam|monde|inde|3|1996|n
Alisha Chinai|Made in India|monde|inde|4|1995|dn
Daler Mehndi|Bolo Ta Ra Ra|monde|inde|5|1995|dj
Apache Indian|Boom Shack-A-Lak|monde|inde|5|1993|d
Shankar Mahadevan|Breathless|monde|inde|4|1998|
Sukhwinder Singh|Chak De India|monde|inde|5|2007|j
Ritviz|Udd Gaye|monde|inde|4|2017|d
Hanumankind|Big Dawgs|monde|inde|5|2024|
Dhanush|Why This Kolaveri Di|monde|inde|3|2011|j
Rahul Sipligunj|Naatu Naatu|monde|inde|5|2022|dj
Shaan|Chand Sifarish|monde|inde|3|2006|r
Kailash Kher|Teri Deewani|monde|inde|3|2005|r
Kassav'|Sé pa djendjen|monde|zouk|4|1989|d
Jocelyne Béroard|Siwo|monde|zouk|2|1987|r
Philippe Lavil|Il tape sur des bambous|monde|zouk|4|1982|jn
Philippe Lavil|Elle préfère l'amour en mer|monde|zouk|3|1985|jn
Edith Lefel|La Klé|monde|zouk|3|1992|r
Edith Lefel|Si seulement|monde|zouk|2|1996|rm
La Compagnie Créole|C'est bon pour le moral|monde|zouk|5|1983|dj
La Compagnie Créole|Ça fait rire les oiseaux|monde|zouk|4|1986|jn
La Compagnie Créole|Le Bal masqué|monde|zouk|5|1984|dj
Joëlle Ursull|White and Black Blues|monde|zouk|3|1990|n
Kali|Monté la riviè|monde|zouk|3|1992|j
Jocelyne Labylle|Laisse parler les gens|monde|zouk|4|2003|dn
Fanny J|Ancrée à ton port|monde|zouk|2|2010|r
Princess Lover|Oh Lover|monde|zouk|3|2009|r
Kalash|Mwaka Moon|monde|zouk|4|2017|
Tabou Combo|New York City|monde|zouk|5|1974|d
# 2.8 : catalogue enrichi (au moins 60 titres par sous-style)
Django Reinhardt|Manoir de mes rêves|jazz|manouche|1|1943|ir
Django Reinhardt|Douce ambiance|jazz|manouche|3|1943|i
Django Reinhardt|Djangology|jazz|manouche|3|1935|i
Django Reinhardt|Rythme futur|jazz|manouche|4|1940|i
Django Reinhardt|Limehouse Blues|jazz|manouche|5|1936|i
Django Reinhardt|Sweet Georgia Brown|jazz|manouche|4|1937|ij
Yehudi Menuhin & Stéphane Grappelli|Night and Day|jazz|manouche|3|1973|ir
Thomas Dutronc|Viens dans mon île|jazz|manouche|3|2007|j
Thomas Dutronc|Jeune, je ne savais rien|jazz|manouche|2|2007|n
Zaz|Sous le ciel de Paris|jazz|manouche|2|2014|r
Paris Combo|Living-Room|jazz|manouche|3|1997|
Stéphane Wrembel|Bistro Fada|jazz|manouche|3|2011|i
Kassav'|An ba chen'n la|monde|zouk|4|1985|d
Kassav'|Mwen alé|monde|zouk|3|1989|dm
Kassav'|Ou lé|monde|zouk|4|1989|dr
Zouk Machine|Sa ki ta la|monde|zouk|4|1990|d
Malavoi|La Filo|monde|zouk|3|1986|i
Francky Vincent|Alice ça glisse|monde|zouk|4|1994|dj
Francky Vincent|Vas-y Francky|monde|zouk|4|1996|dj
Admiral T|Gwadada|monde|zouk|5|2004|d
La Compagnie Créole|Ba moin en ti bo|monde|zouk|4|1985|djn
La Compagnie Créole|Vive le douanier Rousseau|monde|zouk|4|1984|jn
La Compagnie Créole|Bon anniversaire|monde|zouk|4|1985|jn
Tiken Jah Fakoly|Le pays va mal|reggae|fr|3|2002|
Tiken Jah Fakoly|Africain à Paris|reggae|fr|3|2008|
Tiken Jah Fakoly|Quitte le pouvoir|reggae|fr|4|2004|
Danakil|Marley|reggae|fr|3|2011|
Dub Inc|Rude Boy|reggae|fr|4|2008|d
Dub Inc|Hors contrôle|reggae|fr|4|2010|
Pierpoljak|Kingston Karma|reggae|fr|3|1998|
Tryo|Pompafric|reggae|fr|3|1998|j
Tryo|Ce que l'on s'aime|reggae|fr|2|2008|r
Massilia Sound System|Parla Patois|reggae|fr|4|1992|d
Princess Erika|Faut qu'j'travaille|reggae|fr|4|1990|d
Serge Gainsbourg|Des laids des laids|reggae|fr|3|1979|
Serge Gainsbourg|Brigade des stups|reggae|fr|3|1979|
Serge Gainsbourg|Vieille canaille|reggae|fr|3|1979|
Gipsy Kings|Inspiration|latino|flamenco|3|1987|i
Gipsy Kings|Un Amor|latino|flamenco|3|1987|r
Paco de Lucía|Solo Quiero Caminar|latino|flamenco|4|1981|i
Paco de Lucía|Fuente y Caudal|latino|flamenco|3|1973|i
Camarón de la Isla|Rosa María|latino|flamenco|4|1976|r
Camarón de la Isla|Nana del Caballo Grande|latino|flamenco|1|1979|m
Estopa|Cacho a Cacho|latino|flamenco|4|1999|j
Estopa|Vino Tinto|latino|flamenco|4|2004|j
Rosalía|Que No Salga la Luna|latino|flamenco|3|2018|
Rosalía|Catalina|latino|flamenco|2|2017|m
Peret|El Muerto Vivo|latino|flamenco|5|1967|dj
Los Chichos|Ni Más Ni Menos|latino|flamenco|3|1981|n
Los Delinqüentes|El Aire de la Calle|latino|flamenco|4|2001|j
Chambao|Endorfinas en la Mente|latino|flamenco|2|2003|
Chambao|Papeles Mojados|latino|flamenco|2|2007|m
Kiko Veneno|Joselito|latino|flamenco|3|1992|
Remedios Amaya|¿Quién Maneja Mi Barca?|latino|flamenco|3|1983|n
Azúcar Moreno|Solo Se Vive Una Vez|latino|flamenco|5|1990|d
Los Chunguitos|Dame Veneno|latino|flamenco|3|1980|rn
Pata Negra|Blues de la Frontera|latino|flamenco|3|1987|
Lole y Manuel|Todo Es de Color|latino|flamenco|2|1975|n
Kaoma|Dançando Lambada|latino|tropical|5|1989|dj
Juan Luis Guerra|Visa para un Sueño|latino|tropical|4|1989|d
Juan Luis Guerra|A Pedir Su Mano|latino|tropical|5|1990|dj
Marc Anthony|Ahora Quién|latino|tropical|4|2006|dm
Carlos Vives|Carito|latino|tropical|4|2001|dj
Elvis Crespo|Tu Sonrisa|latino|tropical|5|1998|dr
Miami Sound Machine|Conga|latino|tropical|5|1985|dj
Aventura|Un Beso|latino|tropical|3|2002|r
Willie Colón|Calle Luna Calle Sol|latino|tropical|4|1973|d
Daddy Yankee|Lo Que Pasó, Pasó|latino|reggaeton|4|2004|dm
J Balvin|6 AM|latino|reggaeton|4|2014|d
Wisin & Yandel|Pam Pam|latino|reggaeton|5|2005|d
Plan B|Candy|latino|reggaeton|4|2014|d
Rachid Taha|Voilà voilà|monde|orient|4|1993|
Faudel|Tellement N'brick|monde|orient|4|1996|d
Khaled|N'ssi N'ssi|monde|orient|4|1992|d
Gülşen|Of Of|monde|orient|4|2013|d
Haifa Wehbe|Ragab|monde|orient|4|2006|d
Nujabes|Kumomi|lofi|lofi|2|2003|i
Nujabes|Horizon|lofi|lofi|2|2005|i
Nujabes|World's End Rhapsody|lofi|lofi|2|2005|i
Nujabes|Beat Laments the World|lofi|lofi|3|2003|
Nujabes|Letter from Yokosuka|lofi|lofi|1|2003|im
Nujabes|Spiral|lofi|lofi|2|2011|i
J Dilla|Waves|lofi|lofi|3|2006|i
J Dilla|Stop!|lofi|lofi|3|2006|i
J Dilla|Anti-American Graffiti|lofi|lofi|3|2006|i
J Dilla|Bye.|lofi|lofi|2|2006|i
J Dilla|Dilla Says Go|lofi|lofi|3|2006|i
J Dilla|People|lofi|lofi|2|2006|i
potsu|i'm closing my eyes|lofi|lofi|1|2017|m
potsu|bossa uh|lofi|lofi|2|2017|i
idealism|controlla|lofi|lofi|1|2016|i
In Love with a Ghost|Flowers|lofi|lofi|2|2016|j
WYS|Snowman|lofi|lofi|1|2018|i
MF DOOM|Doomsday|lofi|lofi|3|1999|
Uyama Hiroto|One Dream|lofi|lofi|2|2008|i
Madlib|Slim's Return|lofi|lofi|2|2003|i
Slum Village|Climax (Girl Shit)|lofi|lofi|2|2000|r
RJD2|The Horror|lofi|lofi|3|2002|
RJD2|Smoke & Mirrors|lofi|lofi|3|2002|i
Bonobo|Migration|lofi|chillelectro|3|2017|i
Bonobo|Bambro Koyo Ganda|lofi|chillelectro|4|2017|d
Tycho|Coastal Brake|lofi|chillelectro|3|2011|i
Tycho|See|lofi|chillelectro|3|2014|i
Emancipator|First Snow|lofi|chillelectro|2|2006|i
Kiasmos|Blurred|lofi|chillelectro|3|2014|i
Rüfüs Du Sol|You Were Right|lofi|chillelectro|4|2016|d
ODESZA|Higher Ground|lofi|chillelectro|3|2017|
Caribou|Sun|lofi|chillelectro|4|2010|d
Bibio|À tout à l'heure|lofi|chillelectro|3|2011|j
Four Tet|Baby|lofi|chillelectro|3|2020|
Maribou State|Feel Good|lofi|chillelectro|3|2018|j
Boards of Canada|Turquoise Hexagon Sun|lofi|chillelectro|2|1998|i
Brian Eno|Discreet Music|electro|ambient|1|1975|i
Brian Eno|Thursday Afternoon|electro|ambient|1|1985|i
Harold Budd & Brian Eno|First Light|electro|ambient|1|1980|i
Stars of the Lid|Don't Bother They're Here|electro|ambient|1|2007|i
Vangelis|Rachel's Song|electro|ambient|1|1994|m
Hiroshi Yoshimura|Water Copy|electro|ambient|1|1982|i
Indochine|Tes yeux noirs|poprock|fr|3|1985|r
Indochine|Trois nuits par semaine|poprock|fr|4|1985|d
Indochine|Le Baiser|poprock|fr|3|1990|r
Téléphone|Cendrillon|poprock|fr|3|1982|n
Téléphone|Le jour s'est levé|poprock|fr|3|1984|
Louise Attaque|Si l'on marchait jusqu'à demain|poprock|fr|3|2000|
Louise Attaque|Savoir|poprock|fr|4|1997|
BB Brunes|Coups et blessures|poprock|fr|4|2009|
BB Brunes|Le Gang|poprock|fr|4|2007|
Les Innocents|Un homme extraordinaire|poprock|fr|3|1992|
Calogero|Pomme C|poprock|fr|3|2007|
Kyo|Contact|poprock|fr|4|2004|
Cœur de pirate|Comme des enfants|poprock|fr|2|2008|r
Zazie|Rue de la paix|poprock|fr|3|2001|
Zazie|J'envoie valser|poprock|fr|3|1998|
Noir Désir|À ton étoile|poprock|fr|2|2001|m
Johann Sebastian Bach|Concerto for Two Violins in D Minor, BWV 1043: I. Vivace|classique|baroque|4|1730|i
Johann Sebastian Bach|Keyboard Concerto No. 5 in F Minor, BWV 1056: II. Largo|classique|baroque|1|1738|im
Johann Sebastian Bach|Wachet auf, ruft uns die Stimme, BWV 140|classique|baroque|2|1731|
Johann Sebastian Bach|Brandenburg Concerto No. 4: I. Allegro|classique|baroque|4|1721|ij
Antonio Vivaldi|Gloria in D Major, RV 589: I. Gloria|classique|baroque|4|1715|j
Antonio Vivaldi|Nulla in mundo pax sincera, RV 630|classique|baroque|2|1735|
George Frideric Handel|Ombra mai fu|classique|baroque|1|1738|r
George Frideric Handel|Lascia ch'io pianga|classique|baroque|1|1711|m
Giovanni Battista Pergolesi|Stabat Mater: I. Stabat Mater dolorosa|classique|baroque|1|1736|m
Marc-Antoine Charpentier|Te Deum: Prélude|classique|baroque|4|1690|ij
Gregorio Allegri|Miserere|classique|baroque|1|1638|
Two Steps from Hell|Freedom Fighters|bo|epique|5|2010|i
Two Steps from Hell|Black Blade|bo|epique|5|2010|i
Two Steps from Hell|Blackheart|bo|epique|4|2011|
Hans Zimmer|Journey to the Line|bo|epique|3|1998|i
Hans Zimmer|Discombobulate|bo|epique|4|2009|i
Hans Zimmer & James Newton Howard|Why So Serious?|bo|epique|5|2008|i
Ramin Djawadi|Main Title|bo|epique|4|2011|i
Howard Shore|The Riders of Rohan|bo|epique|4|2002|
Howard Shore|Isengard Unleashed|bo|epique|5|2002|
John Williams|The Asteroid Field|bo|epique|5|1980|i
Tatsuro Yamashita|Love Talkin' (Honey It's You)|asie|citypop|3|1982|rn
Tatsuro Yamashita|Your Eyes|asie|citypop|2|1982|rn
Tatsuro Yamashita|Loveland, Island|asie|citypop|4|1982|jn
Anri|Remember Summer Days|asie|citypop|3|1983|n
Masayoshi Takanaka|Brasilian Skies|asie|citypop|3|1978|i
Mariya Takeuchi|Manhattan Kiss|asie|citypop|2|1992|rn
Matt Houston|Pa lagé mwen|monde|zouk|4|2005|d
Matt Houston|Positif|monde|zouk|3|2003|
Francky Vincent|Tu veux mon zizi ?|monde|zouk|4|1991|dj
Slaï|Le Misogyne|monde|zouk|3|2004|
Tabou Combo|Juicy Lucy|monde|zouk|5|1980|d
Zouk Machine|Laisse-moi rêver|monde|zouk|2|1990|r
Django Reinhardt|Swing 39|jazz|manouche|4|1939|i
Django Reinhardt|Swing 48|jazz|manouche|4|1948|i
Django Reinhardt|Anouman|jazz|manouche|2|1949|im
Django Reinhardt|Mélodie au crépuscule|jazz|manouche|2|1943|ir
Django Reinhardt|Troublant boléro|jazz|manouche|3|1941|i
Django Reinhardt|Place de Brouckère|jazz|manouche|4|1942|i
Django Reinhardt|Appel indirect|jazz|manouche|4|1938|i
Django Reinhardt|Festival 48|jazz|manouche|4|1948|i
Django Reinhardt|Babik|jazz|manouche|4|1947|i
Django Reinhardt|Les Yeux noirs|jazz|manouche|4|1940|i
Django Reinhardt|J'attendrai|jazz|manouche|3|1938|in
Django Reinhardt|Honeysuckle Rose|jazz|manouche|4|1937|ij
Thomas Dutronc|Aragon|jazz|manouche|3|2007|
Caravan Palace|Suzy|jazz|manouche|5|2008|d
Alpha Blondy|Sweet Fanta Diallo|reggae|fr|3|1982|r
Alpha Blondy|Apartheid Is Nazism|reggae|fr|4|1985|
Sinsemilia|Résistances|reggae|fr|3|1998|
Dub Inc|Tout ce qu'ils veulent|reggae|fr|4|2010|
Tiken Jah Fakoly|Y'en a marre|reggae|fr|4|2004|
Yannick Noah|Simon Papa Tara|reggae|fr|4|1991|dj
Yannick Noah|Les Lionnes|reggae|fr|3|2006|
Hans Zimmer|Day One|bo|epique|2|2014|i
Hans Zimmer|Up Is Down|bo|epique|5|2007|i
Hans Zimmer|Drink Up Me Hearties Yo Ho|bo|epique|4|2007|i
Rupert Gregson-Williams|Wonder Woman's Wrath|bo|epique|5|2017|i
John Williams|Theme from Superman|bo|epique|5|1978|i
John Williams|Theme from Jurassic Park|bo|epique|3|1993|i
Two Steps from Hell|Flight of the Silverbird|bo|epique|4|2015|i
Gipsy Kings|A mi manera|latino|flamenco|3|1987|
Gipsy Kings|Bem, Bem, Maria|latino|flamenco|4|1987|j
Gipsy Kings|Trista Pena|latino|flamenco|2|1987|m
Gipsy Kings|Pida Me la|latino|flamenco|5|1989|d
Rosalía|De Aquí No Sales|latino|flamenco|3|2018|
`;
