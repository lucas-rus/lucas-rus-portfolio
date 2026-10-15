"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Flame, Globe, Landmark, MapPin, ScrollText, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/Animations";
import { CyberCircuitBackground, SectionDividerWithTelemetry } from "@/components/CyberCircuitLines";

type ViewLang = "both" | "en" | "ro";

interface ProclamationDoc {
  title: string;
  subtitle: string;
  locationBadge: string;
  date: string;
  preamble: string[];
  points: { number: number; paragraphs: string[] }[];
}

const PROCLAMATION_EN: ProclamationDoc = {
  title: "The Proclamation of Timișoara",
  subtitle: "Foundational Charter of the Romanian Revolution & Democratic Renewal",
  locationBadge: "Opera Square (Piața Operei) • Timișoara, First Free City of Romania",
  date: "March 11, 1990",
  preamble: [
    'The people of the city of Timișoara were the initiators of the Romanian Revolution. Between December 16 and 20, 1989, they waged, all on their own, a fierce war against one of the most powerful and odious repressive systems in the entire world. It was a terrifying clash, the true scale of which only we, the people of Timișoara, fully know. On one side stood the unarmed population; on the other, the Securitate, the Militia, the Army, and zealous troops of Party activists. Yet all methods and means of repression proved powerless before the Timișoarans\' desire for freedom and their determination to prevail. Neither arrests, nor beatings, nor even mass assassinations could stop them. Every bullet fired brought another hundred fighters to the barricades of the revolution. And we won. On December 20, 1989, Timișoara definitively came under the control of its people, transforming itself into a free city within the vast prison that Romania had become in those days. From that day forward, all activity in the city was directed from the balcony of the Opera Square by the Romanian Democratic Front, at that moment the exponent of the Timișoara Revolution. On that same day, the army fraternized with the demonstrators, resolving to defend alongside them the victory that had been won. On December 21, in Opera Square, over one hundred thousand voices chanted: "We are ready to die!"',
    "A series of events that have occurred in Romania, particularly after January 28, 1990, run counter to the ideals of the Timișoara Revolution. Moreover, these ideals have only been communicated partially and confusingly to the Romanian public by the central mass media. Under such circumstances, we, the direct participants in all the events between December 16 and 22, 1989, find ourselves compelled to explain to the entire nation why the people of Timișoara started the revolution, what they fought for and why so many sacrificed their lives, and why we remain determined to keep fighting, at any cost and against anyone, until complete victory is achieved.",
  ],
  points: [
    {
      number: 1,
      paragraphs: [
        'From its very first hours, the Timișoara Revolution was not merely anti-Ceaușescu, but categorically anti-communist. Throughout all the days of the revolution, it was chanted hundreds of times: "Down with communism!" In harmony with the aspirations of hundreds of millions of people in Eastern Europe, we too demanded the immediate abolition of this totalitarian and bankrupt social system. The ideal of our revolution was, and remains, a return to the authentic values of European democracy and civilization.',
      ],
    },
    {
      number: 2,
      paragraphs: [
        'All social classes participated in the Timișoara Revolution. In the streets of Timișoara, mowed down by bullets, there fell side by side workers, intellectuals, clerks, university students, schoolchildren, children, and even villagers who had come to support the revolution. We are categorically against the typically communist technique of domination by inciting hatred among social classes and categories. It was on the basis of the "class struggle" ideology that the Bolsheviks rose to power in 1917, and on the exact same basis that the Romanian communist nomenklatura instigated one social class against another after 1944, dividing society so as to subject it more easily to terror. We warn against the danger of repeating this sad history and call upon workers, intellectuals, students, peasants, and all social categories to engage in a civilized and constructive dialogue to restore, without delay, the unity achieved during the revolution. We must start from the reality that all of these social categories were oppressed under the communist regime, and none of them wishes ill upon the others today.',
      ],
    },
    {
      number: 3,
      paragraphs: [
        "People of all age groups took part in the Timișoara Revolution. Even though the youth formed the majority, it is only fair to acknowledge that people of all ages fought with the same steadfastness for the cause of the revolution. The list of victims, though incomplete, stands as proof of this.",
      ],
    },
    {
      number: 4,
      paragraphs: [
        "For the victory of the Timișoara Revolution, alongside Romanians, Hungarians, Germans, Serbs, and members of other ethnic groups—who for centuries have lived together in our city peacefully and in good understanding—also sacrificed themselves. Timișoara is a Romanian and European city, in which the nationalities have rejected and continue to reject nationalism. We invite all chauvinists in Romania, whether they be Romanian, Hungarian, or German, to come to Timișoara for a re-education course in the spirit of tolerance and mutual respect—the only principles that will reign in the future House of Europe.",
      ],
    },
    {
      number: 5,
      paragraphs: [
        'As early as December 16, in the very first hours of the Revolution, one of the most frequently chanted slogans was: "We want free elections!" The idea of political pluralism was and remains one of the dearest to the people of Timișoara. We are convinced that without strong political parties, there can be no authentic, European-style democracy. With the exception of extremist parties, whether of the left or of the right, all parties have the right to exist in the city of Timișoara. In our city, the headquarters of political parties have not been attacked or devastated, nor has any of their members been threatened, insulted, or slandered. Members of political parties are our fellow citizens, our coworkers, our friends who hold political opinions. European democracy means the free expression of political opinions, civilized dialogue among their exponents, and fair competition to win public support and, implicitly, state power. We would have even accepted the Romanian Communist Party into the system of Romanian democracy, had it not been totally and definitively compromised by its nomenklatura, degenerating into Red Fascism. In those Eastern European countries where communist parties maintained a minimum of decency, society contests them in principle, yet tolerates them in practice. Here, however, the Communist Party went so far as to commit genocide, and through this, it excluded itself from society. We will tolerate it neither in principle nor in practice, regardless of the name under which it might try to be reborn.',
      ],
    },
    {
      number: 6,
      paragraphs: [
        'After four decades of exclusively communist education and propaganda, prejudices belonging to this ideology exist in the consciousness of all Romanians. Their mere existence is not a fault of the bearer. Their manipulation, however, by groups interested in the revival of communism and its restoration to power, is a counter-revolutionary act. On the list of photocopied slogans distributed on January 28 to the demonstrators in Banu Manta Square in Bucharest, there were slogans 45 years old. Equating, for example, the "historical" parties with parties that sell out the country is one such slogan and constitutes slander. On the contrary, the communist activists of 45 years ago—some of whom still hold important positions in the country\'s leadership today—are guilty of betraying Romania and enslaving it to the USSR. They are the ones who chanted back then: "Stalin and the Russian people have brought us freedom!", and not the members of the "historical" parties. The latter opposed the transformation of Romania into a satellite of Moscow, and some paid with their lives for this audacity. There is an urgent need to draft a brief yet accurate history of the 1944–1950 period and distribute it in mass print runs.',
      ],
    },
    {
      number: 7,
      paragraphs: [
        "Timișoara started the Revolution against the entire communist regime and its entire nomenklatura, and certainly not to serve as an opportunity for the political rise of a group of anti-Ceaușescu dissidents from within the Romanian Communist Party (PCR). Their presence at the helm of the country renders the deaths of the heroes of Timișoara in vain. We might perhaps have accepted them ten years ago, had they joined Constantin Pârvulescu at the 12th Party Congress and overthrown the dictatorial clan. But they did not do so, even though they had both the opportunity and the important positions that granted them prerogatives. On the contrary, some even obeyed the dictator's order to revile the dissident. Their cowardice in 1979 cost us another ten years of dictatorship—the hardest of the entire period—plus a painful genocide.",
      ],
    },
    {
      number: 8,
      paragraphs: [
        "As a consequence of the previous point, we propose that the electoral law prohibit, for the first three consecutive legislatures, the right of former communist activists and former Securitate officers to run for office on any list. Their presence in the political life of the country is the main source of the tensions and suspicions that trouble Romanian society today. Until the situation stabilizes and national reconciliation is achieved, their absence from public life is absolutely necessary.",
        "We also demand that a special paragraph be included in the electoral law prohibiting former communist activists from running for the office of President of the country. The President of Romania must be one of the symbols of our parting with communism. Having been a party member is not a fault. We all know to what extent an individual's life—from professional fulfillment to receiving housing—was conditioned by the little red booklet, and what grave consequences surrendering it entailed. Activists, however, were those people who abandoned their professions to serve the Communist Party and to benefit from the special material privileges it offered. A person who made such a choice does not present the moral guarantees that a President must offer. We propose reducing the prerogatives of this office, following the model of many civilized countries in the world. Thus, prominent figures of cultural and scientific life, without extensive political experience, could also run for the high office of President of Romania.",
        "Also in this context, we propose that the first legislature last for only two years—the time needed to strengthen democratic institutions and clarify the ideological position of each of the many newly emerged parties. Only then would we be able to make an informed choice, with all cards on the table.",
      ],
    },
    {
      number: 9,
      paragraphs: [
        "Timișoara did not make a revolution for higher wages or other material advantages. For those, a strike would have sufficed. We are all dissatisfied with the wage system; in Timișoara, too, there are categories of workers who toil in extremely harsh conditions and are poorly paid (see, for instance, the case of those working in foundries or the detergent industry), and yet, no collective has gone on strike for pay raises or sent delegates to negotiate exclusively material demands with the government. The majority of Timișoarans know what all economists are striving to make known these days: raising wages at this moment would automatically trigger inflation, just as happened in some Eastern European countries. And once inflation is set in motion, it takes years of effort to stop it. Only an increase in production—and therefore in the quantity of goods on the market—will allow, in parallel, a general increase in wage levels. Furthermore, given Romania's impoverished budget, priority must now be given to expenditures aimed at restoring a minimum level of civilization. Urgent investments are required, for example, in healthcare and public sanitation.",
      ],
    },
    {
      number: 10,
      paragraphs: [
        'Although we militate for the re-Europeanization of Romania, we do not wish to copy Western capitalist systems, which have their own shortcomings and inequities. However, we are categorically in favor of the idea of private initiative. The economic foundation of totalitarianism was the omnipotence of state property. We will never have political pluralism without economic pluralism. Yet voices have emerged that, in a communist spirit, equate private initiative with "exploitation" and the catastrophic danger of rich people appearing. In doing so, they play upon the envy of the lazy and the fear of work held by the formerly privileged within communist enterprises.',
        "Proof that the people of Timișoara do not fear privatization is the fact that several enterprises have already announced their intention to transform themselves into joint-stock companies. However, so that these shares are bought with clean money, commissions should be established in every city to inventory the fortunes of those formerly privileged by power, corruption, and scarcity. Likewise, the shares of an enterprise ought to be offered for purchase first and foremost to its own workers. We also consider constructive the more radical idea of privatization by granting all workers of an enterprise an equal number of shares, with the state retaining only that percentage of funds necessary to ensure oversight of the activity. In this way, all workers would be offered equal chances at prosperity. If the lazy were to lose their chance, they still could not complain of discrimination.",
      ],
    },
    {
      number: 11,
      paragraphs: [
        "Timișoara is determined to take seriously and make use of the principle of economic and administrative decentralization. It has already been proposed to experiment with a market economy model in Timiș County, drawing upon its strong capacities and the competence of the specialists at its disposal. To attract foreign capital more easily and rapidly—especially in the form of technology and special raw materials—and to create joint ventures, we hereby also demand the establishment of a branch of the Bank for Foreign Trade in Timișoara. A portion of the foreign currency earnings of the Romanian side in these joint ventures will go toward workers' wages, in a percentage to be negotiated, on a case-by-case basis, with union leaders. Paying a portion of wages in foreign currency will ensure a strong material incentive for the workers. Moreover, passports will no longer be little booklets good only for keeping in a drawer. Another positive consequence would be the drop in the exchange rate on the open market, which would bring about an immediate rise in the standard of living.",
      ],
    },
    {
      number: 12,
      paragraphs: [
        "After the fall of the dictatorship, all Romanians living in exile were invited back to the country to put their shoulder to the wheel in rebuilding Romania. Some have already returned, while others have announced their intention to do so. Unfortunately, instigated by murky forces, people have also been found to revile the returned exiles, to brand them as traitors, and to ask them tendentiously what they have eaten over the last ten years. This is an attitude that does us no honor. In the despair that gripped us over the past forty years, there was perhaps not a single Romanian into whose mind the thought did not cross, at least once, to escape the misery by taking the path of exile. Many of the Romanians living far from the country today left following political persecution and even after hard years in prison. It would be shameful on our part to revile them too, using the very words of the communist activists of yesteryear. The Romanian exile community means hundreds of eminent professors teaching at the greatest universities in the world, thousands of specialists valued at the most powerful Western firms, and tens of thousands of workers skilled in the most advanced technologies. Let us be proud of them and turn evil into good, making out of the sad and painful Romanian diaspora a renewing force for Romania. Timișoara awaits all Romanian exiles with love. They are our compatriots and, today more than ever, we need their competence, the Europeanism of their thinking, and even their material support. Furthermore, Romanian culture will only be whole once the culture of the exile is reintegrated into it.",
      ],
    },
    {
      number: 13,
      paragraphs: [
        "We do not agree with establishing December 22 as the National Day of Romania. In doing so, the person of the dictator is immortalized, by celebrating each time a number of years since his fall. In most countries that have tied their national day to a revolution, the chosen day is that of the outbreak of the revolutionary movement, thus glorifying the courage of the people in rising up to fight. To give just one example: the national day of France is July 14, the day when, in 1789, the Great French Revolution began with the storming of the Bastille. Consequently, we demand the institution of December 16 as the National Day of Romania. Thus, our children, grandchildren, and great-grandchildren will celebrate the courage of the people in confronting oppression, and not the fall of a vile tyrant.",
        "With the exception of the newspaper România liberă, the press, radio, and television in Bucharest have almost forgotten about the Timișoara Revolution. The events commented upon as revolutionary are solely those of December 21–22. We bow in reverence before the heroes of Bucharest, just as we do before the heroes of Lugoj, Sibiu, Brașov, Târgu Mureș, Cluj, Arad, Reșița, and all the other cities that needed martyrs to win freedom. Yet we are pained and outraged by the central policy of minimizing our revolution, evident also in the effort to downplay the number of the dead. We were on the streets of Timișoara during the days of the revolution, and we know that their number is higher than that officially announced. We assure those who are concealing the truth today, however, that we will not cease our struggle until they are brought before a court of law as accomplices to genocide.",
        "This Proclamation was born out of the necessity to make known to the Romanian nation the true ideals of the Timișoara Revolution. It was a revolution made by the people and by them alone, without the interference of activists and Securitate agents. It was an authentic revolution and not a coup d'état. It was categorically anti-communist, and not merely anti-Ceaușescu. People did not die in Timișoara so that second- and third-tier communist activists could move to the forefront and name one of the participants in the genocide as Minister of the Interior. People did not die so that social and national division, the cult of personality, mass media censorship, disinformation, written and telephone threats, and all the other communist methods of coercion could be practiced in plain sight, while we are asked to remain passive in the name of social stability. This Proclamation is addressed first and foremost to those who received the revolution as a gift and wonder why we are dissatisfied, given that the dictatorship has fallen, a series of bad laws have been repealed, and a few goods have appeared in the shops. Now they know why we are dissatisfied: this was not the ideal of the Timișoara Revolution.",
        "We, the authors of this Proclamation, participants in the events between December 16 and 22, 1989, do not consider the revolution finished. We will continue it, peacefully but firmly. Having confronted and defeated, without anyone's help, one of the most powerful repressive systems in the world, no one and nothing can intimidate us anymore.",
      ],
    },
  ],
};

const PROCLAMATION_RO: ProclamationDoc = {
  title: "Proclamația de la Timișoara",
  subtitle: "Carta Fundamentală a Revoluției Române de la Timișoara",
  locationBadge: "Piața Operei • Timișoara, Primul Oraș Liber al României",
  date: "11 martie 1990",
  preamble: [
    'Populația orașului Timișoara a fost inițiatoarea Revoluției române. Între 16 și 20 decembrie 1989, ea a purtat, de una singură, un înverșunat război cu unul dintre cele mai puternice și mai odioase sisteme represive din întreaga lume. A fost o încleștare cumplită, pe care numai noi, timișorenii, o cunoaștem la adevăratele ei proporții. De-o parte populația neînarmată, de cealaltă parte Securitatea, Miliția, Armata și trupele zeloase de activiști ai partidului. Toate metodele și mijloacele de reprimare s-au dovedit însă neputincioase în fața dorinței de libertate a timișorenilor și hotărârii lor de a învinge. Nici arestările, nici molestările, nici chiar asasinatele în masă nu i-au putut opri. Fiecare glonț tras a adus pe baricadele revolutiei alti o sută de luptători. Și am învins. În 20 decembrie 1989 Timișoara a intrat definitiv în stăpânirea populației, transformându-se într-un oraș liber în marea închisoare care devenise în acele zile România. Din acea zi, întreaga activitate din oraș a fost condusă de la tribuna din Piața Operei de către Frontul Democrat Român, exponent în acel moment al Revoluției de la Timișoara. În aceeași zi, armata a fraternizat cu demonstranții, hotărând să apere împreună cu ei victoria obținută. În 21 decembrie, în Piața Operei, peste o sută de mii de glasuri scandau: "Suntem gata să murim!".',
    "O serie de fapte întâmplate în România, îndeosebi după 28 ianuarie 1990, vin în contradictie cu idealurile Revoluției de la Timișoara. Aceste idealuri nici nu au fost aduse la cunoștința opiniei publice românești de către mass-media centrală decât parțial și confuz. În asemenea condiții, noi, participanții nemijlociți la toate evenimentele dintre 16 și 22 decembrie 1989, ne vedem nevoiți să explicăm întregii națiuni pentru ce au pornit timișorenii revoluția, pentru ce au luptat și mulți și-au jerfit viața, pentru ce suntem în continuare hotărâți să luptăm, cu orice preț și împotriva oricui, până la victoria deplină.",
  ],
  points: [
    {
      number: 1,
      paragraphs: [
        'Revoluția de la Timișoara a fost, încă din primele ei ore, nu doar anticeaușistă, ci și categoric anticomunistă. În toate zilele revoluțtiei s-a scandat, de sute de ori: "Jos comunismul!" În consens cu aspirația sutelor de milioane de oameni din Estul Europei, am cerut și noi abolirea imediată a acestui sistem social totalitar și falimentar. Idealul revoluției noastre a fost și a rămas reîntoarcerea la valorile autentice ale democrației și civilizației europene.',
      ],
    },
    {
      number: 2,
      paragraphs: [
        'La revoluția de la Timișoara au participat toate categoriile sociale. Pe străzile Timișoarei au căzut secerați de gloanțe, unul lângă altul, muncitori, intelectuali, funcționari, studenți, elevi, copii și chiar locuitori ai satelor, veniți în sprijinul revoluției. Suntem categoric împotriva tehnicii, tipic comuniste, de dominație prin învrăjbirea claselor și categoriilor sociale. Pe temeiul ideologiei "luptei de clasă" s-au urcat la putere bolșevicii în 1917, pe același temei nomenclatura comunistă română a instigat după 1944 o clasă socială împotriva alteia, a dezbinat societatea pentru a o supune mai ușor terorii. Avertizăm împotriva pericolului repetării acestei triste istorii și chemăm muncitorii, intelectualii, studenții, țăranii și toate categoriile sociale la un dialog civilizat și constructiv, pentru a reface neîntârziat unitatea din timpul revoluției. Trebuie plecat de la realitatea că toate aceste categorii sociale au fost oprimate în regimul comunist și nici una nu dorește astăzi răul celorlalte.',
      ],
    },
    {
      number: 3,
      paragraphs: [
        "La Revoluția de la Timișoara au luat parte oameni din toate categoriile de vârstă. Chiar dacă tineretul a fost preponderent, este drept să recunoaștem că oameni de toate vârstele s-au bătut cu aceeași dârzenie pentru cauza revoluției. Lista victimelor, deși incompletă, este o dovadă în acest sens.",
      ],
    },
    {
      number: 4,
      paragraphs: [
        "Pentru victoria Revoluției din Timișoara s-au jertfit, alături de români și maghiari, și germani, și sârbi și membri ai altor grupări etnice, care de secole conlocuiesc în orașul nostru, pașnic, în bună înțelegere. Timișoara este un oraș românesc și european, în care naționalitățile au refuzat și refuză naționalismul. Invităm pe toți șovinii din România, indiferent că sunt români, maghiari sau germani, să vină la Timișoara la un curs de reeducare în spiritul toleranței și al respectului reciproc, singurele principii care vor domni în viitoarea Casă a Europei.",
      ],
    },
    {
      number: 5,
      paragraphs: [
        'Încă în data de 16 decembrie, din primele ore ale Revoluției, una dintre lozincile cel mai des scandate a fost: "Vrem alegeri libere!" Ideea pluralismului politic a fost și a rămas una dintre cele mai scumpe timișorenilor. Suntem convinși că fără partide politice puternice nu poate exista o democrație autentică, de tip european. Cu excepția celor extremiste, de stânga sau de dreapta, toate partidele au drept la existență în cetatea Timișoarei. În orașul nostru nu au fost atacate și devastate sediile partidelor politice, nici unul dintre membrii acestora nu a fost amenințat, insultat sau calomniat. Membrii partidelor politice sunt concetățenii noștri, sunt colegii noștri de muncă, sunt prietenii noștri care au opinii politice. Democrația europeană înseamnă libera exprimare a opiniilor politice, dialogul civilizat între exponenții lor și competiția loială pentru cucerirea adeziunii publice și, implicit, a puterii în stat. Am fi acceptat în sistemul democrației românești și Partidul Comunist Român, dacă el nu ar fi fost compromis total si definitiv de către nomenclatura sa, degenerând în fascism rosu. În tările est-europene în care partidele comuniste și-au păstrat o minimă decență, societatea le contestă în principiu, dar le tolerează în fapt. La noi, partidul comunist a ajuns însă până la genocid și, prin aceasta, s-a autoexclus din societate. Nu-l vom tolera nici în principiu, nici în fapt, indiferent sub ce denumire ar încerca să renască.',
      ],
    },
    {
      number: 6,
      paragraphs: [
        'După patru decenii de educație și propagandă exclusiv comuniste, există în conștiința tuturor românilor prejudecăți aparținând acestei ideologii. Existența lor nu este o vină pentru purtător. Manipularea lor însă, de către grupuri interesate în renașterea comunismului și reinstaurarea lui la putere este un act contrarevoluționar. Pe lista de lozinci multiplicată la xerox și împărțită în 28 ianuarie demonstranților din Piața Banu Manta din București se aflau și slogane vechi de 45 de ani. Identificarea, de pildă, a partidelor "istorice" cu partide vânzătoare de țară este un astfel de slogan și constituie o calomnie. Dimpotrivă, activiștii comuniști de acum 45 de ani, dintre care unii au și astăzi funcții importante în conducerea țării, se fac vinovați de trădarea României și aservirea ei URSS-ului. Ei sunt cei care scandau atunci: "Stalin și poporul rus libertate ne-au adus!" și nu membrii partidelor "istorice". Aceștia din urmă s-au opus transformării României într-un satelit al Moscovei și unii au plătit cu viața această îndrăzneală. Se impune redactarea de urgență a unei scurte dar corecte istorii a perioadei 1944-1950 și difuzarea ei în tiraje de masă.',
      ],
    },
    {
      number: 7,
      paragraphs: [
        "Timișoara a pornit Revoluția împotriva întregului regim comunist și întregii sale nomenclaturi și nicidecum pentru a servi ca prilej de ascensiune politică unui grup de dizidenți anticeaușiști din interiorul P.C.R.-ului. Prezența acestora în fruntea țării face moartea eroilor din Timișoara zadarnică. I-am fi acceptat poate în urmă cu zece ani, dacă la Congresul al XII-lea al partidului s-ar fi alăturat lui Constantin Pârvulescu și ar fi răsturnat clanul dictatorial. Dar n-au făcut-o, deși aveau și prilejul și funcții importante care le acordau prerogative. Dimpotrivă, unii chiar au ascultat de ordinul dictatorului de a-l huli pe dizident. Lașitatea lor din 1979 ne-a costat încă zece ani de dictatură, cei mai grei din toată perioada, plus un genocid dureros.",
      ],
    },
    {
      number: 8,
      paragraphs: [
        "Ca o consecință a punctului anterior, propunem ca legea electorală să interzică pentru primele trei legislaturi consecutive dreptul la candidatură, pe orice listă, al foștilor activiști comuniști și al foștilor ofițeri de Securitate. Prezența lor în viata politică a țării este principala sursă a tensiunilor și suspiciunilor care frământă astăzi societatea românească. Până la stabilizarea situației și reconcilierea națională, absența lor din viața publică este absolut necesară.",
        "Cerem, de asemenea, ca în legea electorală să se treacă un paragraf special care să interzică foștilor activiști comuniști candidatura la funcția de președinte al țării. Președintele României trebuie să fie unul dintre simbolurile despărțirii noastre de comunism. A fi fost membru de partid nu este o vină. Știm cu toții în ce măsură era condiționată viața individului, de la realizarea profesională până la primirea unei locuințe, de carnetul roșu, și ce consecințe grave atrăgea predarea lui. Activiștii au fost însă acei oameni care și-au abandonat profesiile pentru a sluji partidul comunist și a beneficia de privilegiile materiale deosebite oferite de acesta. Un om care a făcut o asemenea alegere nu prezintă garanțiile morale pe care trebuie să le ofere un Președinte. Propunem reducerea prerogativelor acestei funcții, după modelul multor țări civilizate ale lumii. Astfel, pentru demnitatea de Președinte al României ar putea candida și personalități marcante ale vieții culturale și științifice, fără o experiență politică deosebită.",
        "Tot în acest context, propunem ca prima legislatură să fie de numai doi ani, timp necesar întăririi instituțiilor democratice și clarificării poziției ideologice a fiecăruia dintre multele partide apărute. De abia atunci am putea face o alegere în cunoștință de cauză, cu cărțile pe masă.",
      ],
    },
    {
      number: 9,
      paragraphs: [
        "Timișoara nu a făcut revolutie pentru salarii mai mari sau pentru alte avantaje materiale. Pentru acestea era suficientă o grevă. Suntem toți nemulțumiți de sistemul de salarizare, sunt și în Timișoara categorii de muncitori care lucrează în condiții extrem de grele și sunt prost plătiți (vezi, de pildă, cazul celor ce muncesc în turnătorii sau în industria detergenților) și, totuși, nici un colectiv nu a făcut grevă pentru mărirea lefurilor și nu și-a trimis delegați să trateze cu guvernul revendicări materiale exclusive. Majoritatea timișorenilor știu ceea ce toti economiștii se străduiesc în aceste zile să aducă la cunoștință: mărirea în acest moment a salariilor ar declanșa automat inflația, așa cum s-a întâmplat în unele țări est-europene. Iar inflația odată pornită, sunt necesari ani de eforturi pentru a o stopa. Numai creșterea producției, deci a cantității de marfă aflată pe piață, va permite, în paralel, creșterea generală a nivelului de salarizare. În plus, pentru bugetul sărac al României, prioritare trebuie să fie acum cheltuielile destinate restabilirii unui nivel minim de civilizație. Se impun, de pildă, investiții urgente în domeniul asistenței medicale și salubrității.",
      ],
    },
    {
      number: 10,
      paragraphs: [
        'Deși milităm pentru re-europenizarea României, nu dorim copierea sistemelor capitaliste occidentale, care își au neajunsurile și inechitățile lor. Suntem însă categoric în favoarea ideii de inițiativă particulară. Fundamentul economic al totalitarismului a fost atotputernicia proprietății de stat. Nu vom avea niciodată pluralism politic fără pluralism economic. S-au găsit însă și voci care, în spirit comunist, să asimileze inițiativa privată cu "exploatarea" și pericolul catastrofei de a apărea oameni bogați. Se speculează în acest sens invidia leneșului și teama de muncă a fostului privilegiat din întreprinderile comuniste.',
        "Dovadă că timișorenii nu se tem de privatizare este faptul că mai multe întreprinderi și-au anuntat deja intenția de a se transforma în societăți anonime pe acțiuni. Pentru ca aceste acțiuni să fie totuși cumpărate pe bani curați, ar trebui înființate în fiecare oraș comisii de inventariere a averilor foștilor privilegiați ai puterii, corupției și penuriei. De asemenea, acțiunile unei întreprinderi se cuvin oferite spre cumpărare în primul rând lucrătorilor ei. Considerăm constructivă și ideea, mai radicală, a privatizării prin împroprietărirea tuturor lucrătorilor unei întreprinderi cu un număr egal de acțiuni, statul urmând să păstreze numai acel procent de fonduri care să-i asigure controlul activității. În felul acesta, s-ar oferi tuturor lucrătorilor șanse egale la prosperitate. Dacă cei leneși și-ar pierde șansa, nu s-ar putea totuși plânge de discriminare.",
      ],
    },
    {
      number: 11,
      paragraphs: [
        "Timișoara este hotărâtă să ia în serios și să se folosească de principiul descentralizării economice și administrative. S-a și propus experimentarea în județul Timiș a unui model de economie de piață, pornind de la capacitățile sale puternice și de la competența specialiștilor de care dispune. Pentru atragerea mai ușoară și mai rapidă a capitalului străin, îndeosebi sub formă de tehnologie și materii prime speciale și crearea de societăți mixte, cerem și pe această cale înființarea la Timișoara a unei filiale a Băncii de Comerț Exterior. O parte din câștigurile în valută ale părții române din aceste societăți mixte va intra în salariile muncitorilor într-un procent ce va fi negociat, de la caz la caz, cu liderii sindicali. Plata unei părti din salariu în valută va asigura o bună cointeresare materială a muncitorilor. În plus, pașapoartele nu vor mai fi carnețele bune doar de ținut în sertar. O altă consecință pozitivă ar fi scăderea cursului valutar la bursa liberă, ceea ce ar atrage după sine creșterea imediată a nivelului de trai.",
      ],
    },
    {
      number: 12,
      paragraphs: [
        "După căderea dictaturii au fost invitați în țară toți românii plecați în exil, pentru a pune umărul la reconstrucția României. Unii s-au și întors, alții și-au anunțat intenția de a o face. Din păcate, instigați de forțe obscure, s-au găsit și oameni care să-i hulească pe exilații reîntorși, să-i califice drept trădători, să-i întrebe tendențios ce au mâncat în ultimii zece ani. Este o atitudine care nu ne face cinste. În disperarea care ne-a stăpânit în ultimii patruzeci de ani, poate că nu a fost român căruia să nu-i fi trecut prin minte, măcar o dată, să scape de mizerie luând calea exilului. Mulți dintre românii aflați astăzi departe de țară au plecat după persecuții politice și chiar după ani grei de închisoare. Ar fi rușinos din partea noastră să-i hulim și noi cu vorbele activiștilor comuniști de odinioară. Exilul românesc înseamnă sute de profesori eminenți care predau la cele mai mari universități din lume, mii de specialiști prețuiți la cele mai puternice firme occidentale, zeci de mii de muncitori calificați pe tehnologiile cele mai avansate. Să fim mândri de ei și să transformăm răul în bine, făcând din trista și dureroasa diasporă româneascâ o forță înnoitoare pentru România. Timișoara îi așteaptă cu dragoste pe toți exilații români. Sunt compatrioții noștri și, azi mai mult ca niciodată, avem nevoie de competența lor, de europenismul gândirii lor și chiar de sprijinul lor material. De asemenea, cultura română va fi întreagă numai după ce se reintegrează în ea cultura din exil.",
      ],
    },
    {
      number: 13,
      paragraphs: [
        "Nu suntem de acord cu stabilirea zilei de 22 decembrie ca zi națională a României. În felul acesta se eternizează persoana dictatorului, de fiecare dată sărbătorindu-se un număr de ani de la căderea lui. În majoritatea țărilor care și-au legat ziua națională de revoluție, ziua aleasă este cea a declanșării mișcării revoluționare, fiind astfel glorificat curajul poporului de a se ridica la luptă. Un singur exemplu: ziua națională a Franței este 14 iulie, ziua când, în 1789, a început Marea Revoluție franceză prin dărâmarea Bastiliei. În consecință, cerem instituirea zilei de 16 decembrie ca zi națională a României. Astfel, copiii, nepoții și strănepoții noștri vor celebra curajul poporului de a înfrunta opresiunea și nu căderea unui tiran nemernic.",
        "Cu excepția ziarului România liberă, presa, radioul și televiziunea din București aproape că au uitat de Revoluția de la Timișoara. Evenimentele comentate ca revoluționare sunt numai cele din 21-22 decembrie. Ne închinăm cu pietate în fața eroilor bucureșteni, ca și în fața eroilor din Lugoj, Sibiu, Brașov, Tg. Mureș, Cluj, Arad, Reșița și din toate celelalte orașe care au avut nevoie de martiri pentru a cuceri libertatea. Ne doare și ne revoltă însă politica centrală de minimalizare a revoluției noastre, evidentă și prin efortul de diminuare a numărului morților. Noi am fost pe străzile Timișoarei în zilele revoluției și știm că numărul lor este mai mare decât cel anunțat oficial. Îi asigurăm însă pe acei care astăzi tăinuiesc adevărul că nu vom înceta lupta până nu vor fi aduși în fața instanței în calitate de complici la genocid.",
        "Această Proclamație s-a născut din necesitatea de a aduce la cunoștința națiunii române adevăratele idealuri ale Revoluției de la Timișoara. A fost o revoluție făcută de popor și numai de el, fără amestecul activiștilor și securiștilor. A fost o revoluție autentică și nu o lovitură de stat. A fost categoric anticomunistă și nu doar anticeaușistă. La Timișoara nu s-a murit pentru ca activiștii comuniști din rândurile doi și trei să treacă în frunte și unul dintre participanții la genocid să fie numit de către aceștia ministru de interne. Nu s-a murit pentru ca dezbinarea socială și națională, cultul de personalitate, cenzura din mass-media, dezinformarea, amenințările telefonice și scrise și toate celelalte metode comuniste de constrângere să fie practicate în văzul lumii, în timp ce nouă ni se cere pasivitate în numele stabilității sociale. Această Proclamație se adresează în primul rând celor care au primit revoluția cadou și se miră de ce suntem nemulțumiți, de vreme ce dictatura a căzut, s-au abrogat o serie de legi proaste și a mai apărut și câte ceva prin prăvălii. Acum știu de ce suntem nemulțumiți: nu acesta a fost idealul Revoluției de la Timișoara.",
        "Noi, autorii acestei Proclamații, participanți la evenimentele dintre 16 și 22 decembrie 1989, nu considerăm revoluția încheiată. O vom continua, pașnic dar ferm. După ce am înfruntat și am învins, fără ajutorul nimănui, unul dintre cele mai puternice sisteme represive din lume, nimeni și nimic nu ne mai poate intimida.",
      ],
    },
  ],
};

function ProclamationDocumentCard({
  doc,
  langTag,
  accentColor,
}: {
  doc: ProclamationDoc;
  langTag: string;
  accentColor: "cyan" | "amber";
}) {
  const borderClass =
    accentColor === "cyan"
      ? "border-cyan-500/30 hover:border-cyan-400/50"
      : "border-amber-500/30 hover:border-amber-400/50";
  const badgeClass =
    accentColor === "cyan"
      ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/30"
      : "bg-amber-500/15 text-amber-300 border-amber-500/30";
  const numClass =
    accentColor === "cyan"
      ? "bg-cyan-500/15 text-cyan-300 border-cyan-500/40"
      : "bg-amber-500/15 text-amber-300 border-amber-500/40";

  return (
    <article
      className={`relative glass-card rounded-2xl border ${borderClass} bg-slate-900/75 backdrop-blur-xl p-5 sm:p-8 md:p-11 shadow-2xl overflow-hidden`}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/70" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/70" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/70" />

      {/* Document Header */}
      <header className="pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${badgeClass}`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>{langTag}</span>
          </span>
          <span className="text-xs font-mono text-slate-400 bg-slate-950/70 px-3 py-1 rounded-lg border border-slate-800">
            {doc.date}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {doc.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-mono mt-2 flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>{doc.locationBadge}</span>
        </p>
      </header>

      {/* Preamble */}
      <div className="space-y-4 sm:space-y-5 text-slate-200 text-sm sm:text-base leading-relaxed mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-white/10">
        {doc.preamble.map((para, i) => (
          <p key={i} className="text-justify sm:text-left">
            {para}
          </p>
        ))}
      </div>

      {/* The 13 Points */}
      <div className="space-y-5 sm:space-y-6">
        {doc.points.map((pt) => (
          <div
            key={pt.number}
            className="p-4 sm:p-6 rounded-xl bg-slate-950/65 border border-white/5 hover:border-cyan-500/25 transition-colors"
          >
            <div className="flex items-start gap-3.5 sm:gap-4">
              <span
                className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-mono text-xs sm:text-sm font-bold border shrink-0 mt-0.5 ${numClass}`}
              >
                {pt.number}
              </span>
              <div className="space-y-3.5 text-slate-300 text-sm sm:text-base leading-relaxed flex-1">
                {pt.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-justify sm:text-left">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Footer Signature */}
      <footer className="mt-8 sm:mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Timișoara • December 16–20, 1989</span>
        </div>
        <div className="text-sm sm:text-base font-mono font-bold text-white tracking-wider">
          {doc.date}
        </div>
      </footer>
    </article>
  );
}

export default function TimisoaraProclamationPage() {
  const [viewLang, setViewLang] = useState<ViewLang>("both");

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden bg-[#0a0f1d] text-slate-100 selection:bg-primary/30 selection:text-white">
      {/* Ambient Depth Gradients & Cyber Circuit Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-full max-w-[100vw]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-10%,rgba(59,130,246,0.08),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-aurora-1" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-teal-500/8 rounded-full blur-[160px] animate-aurora-2" />
        <CyberCircuitBackground />
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 w-full z-40 bg-[#0a0f1d]/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-3">
            <Link
              href="/#contact"
              className="group inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Portfolio</span>
            </Link>

            {/* Language Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-white/10">
              {[
                { id: "both", label: "EN + RO (Both)" },
                { id: "en", label: "English" },
                { id: "ro", label: "Română" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewLang(tab.id as ViewLang)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer ${
                    viewLang === tab.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 max-w-5xl mx-auto">
        <FadeIn className="space-y-4 sm:space-y-6 text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur-sm">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>TIMIȘOARA HERITAGE ARCHIVE // 45.7537° N, 21.2257° E</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The Proclamation of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-300">
              Timișoara
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Read from the balcony of the Opera Square on <strong className="text-white">March 11, 1990</strong> by the citizens of Timișoara—the initiators of the December 1989 Romanian Revolution—affirming the ideals of European democracy, pluralism, mutual respect, and freedom.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs font-mono text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              13 Foundational Articles
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-amber-300">
              <Globe className="w-3.5 h-3.5" />
              English &amp; Romanian Verbatim Editions
            </span>
          </div>
        </FadeIn>

        {/* English Edition */}
        {(viewLang === "both" || viewLang === "en") && (
          <section id="english-edition" className="mb-12 sm:mb-16">
            <SectionDividerWithTelemetry
              label="EDITION_01 // ENGLISH TRANSLATION (MARCH 11, 1990)"
              coords="TIMIȘOARA, ROMANIA"
            />
            <ProclamationDocumentCard
              doc={PROCLAMATION_EN}
              langTag="ENGLISH EDITION // THE PROCLAMATION OF TIMIȘOARA"
              accentColor="cyan"
            />
          </section>
        )}

        {/* Romanian Original Edition */}
        {(viewLang === "both" || viewLang === "ro") && (
          <section id="romanian-edition">
            <SectionDividerWithTelemetry
              label="EDIȚIA_02 // TEXTUL ORIGINAL ÎN LIMBA ROMÂNĂ (11 MARTIE 1990)"
              coords="PIAȚA OPEREI, TIMIȘOARA"
            />
            <ProclamationDocumentCard
              doc={PROCLAMATION_RO}
              langTag="TEXT ORIGINAL (ROMÂNĂ) // PROCLAMAȚIA DE LA TIMIȘOARA"
              accentColor="amber"
            />
          </section>
        )}

        {/* Bottom Return Button */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/#contact"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Return to Lucas Rus Portfolio</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
