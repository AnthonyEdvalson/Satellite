
// =========== WEATHER ============
const TAU = Math.PI * 2;


// halving rain frequency: condition delay *1.5+1, replace 1/2 of PRECIP and PRECIP

const weatherZones = {
    "OCEAN": {
        // Ponta Delgata (https://weatherspark.com/y/31464/Average-Weather-in-Ponta-Delgada-Portugal-Year-Round)
        tempMaxVar: 5,
        tempSummer: 70,
        tempWinter: 60,

        sun: 0.5,
        windAvg: 13,

        conditionDelay: 8.5,
        conditionsSummer: ["PRECIP", "WIND", "WIND", "FOG", "COLD", "HOT"],
        conditionsWinter: ["PRECIP", "PRECIP", "WIND", "FOG", "COLD", "HOT"],

        bounds: [
            {x: -1, y: -1},
            {x: 2, y: -1},
            {x: 2, y: 2},
            {x: -1, y: 2},
        ]
    },
    "OCEAN_HOT": {
        // Jeddah (https://weatherspark.com/y/101171/Average-Weather-in-Jeddah-Saudi-Arabia-Year-Round)
        tempMaxVar: 10,
        tempSummer: 90,
        tempWinter: 75,

        sun: 0.75,
        windAvg: 9,

        conditionDelay: 16,
        conditionsSummer: ["PRECIP", "DRYSTORM", "DRYSTORM", "DRYSTORM", "WIND", "WIND", "WIND", "HOT", "HOT", "COLD"],
        conditionsWinter: ["PRECIP", "PRECIP", "DRYSTORM", "DRYSTORM", "WIND", "WIND", "HOT", "HOT", "HOT", "COLD"],

        bounds: [
            {x: -1, y: 0.8},
            {x: 0.40, y: 0.55},
            {x: 0.53, y: 0.67},
            {x: 0, y: 2},
            {x: -1, y: 2},
        ]
    },
    "OCEAN_COLD": {
        // Honningsvag (https://weatherspark.com/y/92831/Average-Weather-in-Honningsv%C3%A5g-Norway-Year-Round)
        tempMaxVar: 7,
        tempSummer: 25,
        tempWinter: 15,

        sun: 0.2,
        windAvg: 14,

        conditionDelay: 7,
        conditionsWinter: ["PRECIP", "PRECIP", "PRECIP", "WIND", "COLD", "NORTHLIGHT"],
        conditionsSummer: ["PRECIP", "PRECIP", "PRECIP", "WIND", "COLD", "NORTHLIGHT"],

        bounds: [
            {x: -1, y: 0.6},
            {x: 0.55, y: 0.4},
            {x: 0.64, y: 0.35},
            {x: 2, y: 0.2},
            {x: -1, y: -0.5},
        ]
    },
    "PENRITH": {
        // Virginia
        tempMaxVar: 12,
        tempSummer: 70,
        tempWinter: 40,

        sun: 0.6,
        windAvg: 5,

        conditionDelay: 6,
        conditionsSummer: ["PRECIP", "PRECIP", "PRECIP", "PRECIP", "FOG",    "FOG", "FOG", "WIND", "COLD", "HOT"],
        conditionsWinter: ["PRECIP", "PRECIP", "PRECIP", "PRECIP", "PRECIP", "FOG", "FOG", "WIND", "COLD", "HOT"],

        bounds: [{"x":1.0022810907230542,"y":0.7774837839558579},{"x":0.9167100867905376,"y":0.7562272925331308},{"x":0.8338642740660629,"y":0.7142593479292851},{"x":0.7962566353950843,"y":0.7049936978219427},{"x":0.7613741879321476,"y":0.6979082006810337},{"x":0.7482932701335464,"y":0.6613906384932717},{"x":0.7090505167377426,"y":0.6450394912450201},{"x":0.6959695989391413,"y":0.6455845294866286},{"x":0.6856138723485821,"y":0.6543051413523627},{"x":0.6627222662010298,"y":0.6423143000369782},{"x":0.6480062336776033,"y":0.6172425409229925},{"x":0.5994978301744571,"y":0.6434043765201951},{"x":0.5836917211678139,"y":0.6804669769495653},{"x":0.5994978301744571,"y":0.7077188890299846},{"x":0.6147589009394919,"y":0.7453265277009631},{"x":0.6131237862146668,"y":0.7671280573652985},{"x":0.619119206872359,"y":0.7834792046135501},{"x":0.6965146371807497,"y":0.7987402753785849},{"x":0.7215863962947354,"y":0.8194517285597036},{"x":0.6856138723485821,"y":0.8292624169086545},{"x":0.6349253158790021,"y":0.8516089848145983},{"x":0.6098535567650164,"y":0.8919418146936189},{"x":0.6272947804964848,"y":0.8919418146936189},{"x":0.6469161571943867,"y":0.8772257821701925},{"x":0.6670825721338969,"y":0.8870364705191434},{"x":0.7559238055160638,"y":0.886491432277535},{"x":0.7515568006951234,"y":0.9054364991209584},{"x":0.7316940803538985,"y":0.9257310177304707},{"x":0.6487888128426992,"y":0.9278900090719082},{"x":0.6518114007207116,"y":0.9386849657790955},{"x":0.7006046050371988,"y":0.957252291315458},{"x":0.6790146916228239,"y":1.0021593112173577},{"x":1.0041587876433091,"y":1.0012957146807826},{"x":1.0028633928384467,"y":0.7789196065127217}]
    },
    "SHASKOCHA": {
        // Macapa (https://weatherspark.com/y/29785/Average-Weather-in-Macap%C3%A1-Brazil-Year-Round)
        // And Honoka'a (https://weatherspark.com/y/191/Average-Weather-in-Honoka%E2%80%98a-Hawaii-United-States-Year-Round)
        tempMaxVar: 7,
        tempSummer: 80,
        tempWinter: 80,

        sun: 0.5,
        windAvg: 5,

        conditionDelay: 4,
        conditionsSummer: ["PRECIP", "PRECIP", "PRECIP", "PRECIP", "PRECIP", "HOT", "ASH"],
        conditionsWinter: ["PRECIP", "PRECIP", "PRECIP", "PRECIP", "PRECIP", "HOT", "ASH"],

        bounds: [{"x":0.7414420066433003,"y":0.44076494872305305},{"x":0.7432777411927268,"y":0.4763781989819297},{"x":0.7799924321812595,"y":0.5670634857236052},{"x":0.818910004629104,"y":0.6092853803604177},{"x":0.8857978414627816,"y":0.6326404778448003},{"x":0.9186121680512631,"y":0.6303929212291508},{"x":0.9774981513812778,"y":0.583643743623643},{"x":0.9464818700853159,"y":0.5359955433718754},{"x":0.8947880679253793,"y":0.506777307368433},{"x":0.8354525732722348,"y":0.4865492978275882},{"x":0.8057848259456625,"y":0.4474418127152884},{"x":0.7594851596632846,"y":0.4303603824363529}]
    },
    "SHASKOCHA_VOLCANO": {
        tempMaxVar: 5,
        tempSummer: 90,
        tempWinter: 90,

        sun: 0.9,
        windAvg: 10,

        conditionDelay: 8,
        conditionsSummer: ["PRECIP", "DRYSTORM", "ASH", "ASH", "ASH"],
        conditionsWinter: ["PRECIP", "DRYSTORM", "ASH", "ASH", "ASh"],

        bounds: [{"x":0.8930019816170912,"y":0.5085709856224017},{"x":0.8334098432722992,"y":0.4895925976145061},{"x":0.7996283126182451,"y":0.44935841503776747},{"x":0.816708861825351,"y":0.4231682395868716},{"x":0.8003874481385609,"y":0.38862757341250165},{"x":0.8360668175934045,"y":0.3806566504491855},{"x":0.8520086635200368,"y":0.3628169657217637},{"x":0.8903450072959859,"y":0.32903543506770955},{"x":0.9131190729054606,"y":0.35522561051860546},{"x":0.9290609188320929,"y":0.39090497997344914},{"x":0.9294404865922508,"y":0.4334165691111352},{"x":0.9560102298033045,"y":0.4782055648097687},{"x":0.9294404865922508,"y":0.5021183336997173}]
    },
    "MARITHAS": {
        // Dease Lake (https://weatherspark.com/y/145149/Average-Weather-at-Dease-Lake-B.-C.-Canada-Year-Round)
        tempMaxVar: 10,
        tempSummer: 50,
        tempWinter: 10,

        sun: 0.4,
        windAvg: 5,

        conditionDelay: 5.5,
        conditionsSummer: ["PRECIP", "PRECIP", "PRECIP", "PRECIP", "PRECIP", "COLD", "COLD", "FOG"],
        conditionsWinter: ["PRECIP", "PRECIP", "PRECIP", "PRECIP", "PRECIP", "COLD", "COLD", "NORTHLIGHT"],
        
        bounds: [{"x":0.28362147148730993,"y":0.4527452082787821},{"x":0.2239353409099907,"y":0.4071028731314204},{"x":0.2925584322154646,"y":0.395931672221227},{"x":0.29319678655319,"y":0.35635370328225596},{"x":0.3094748221651861,"y":0.3231592777205384},{"x":0.335647350011925,"y":0.29954016722470084},{"x":0.3640541180407026,"y":0.2925182695097221},{"x":0.43331556368390184,"y":0.30783877361513023},{"x":0.4709784696096968,"y":0.29602921836721147},{"x":0.4952359344432597,"y":0.31709491151214764},{"x":0.4831072020264783,"y":0.32826611242234105},{"x":0.44512511893182066,"y":0.3327345927864184},{"x":0.42788955181323646,"y":0.35539617177566796},{"x":0.4572538513486021,"y":0.37231256172538946},{"x":0.46619081207675683,"y":0.40263439276734303},{"x":0.43842239838570457,"y":0.42338090874341655},{"x":0.3975677207712829,"y":0.4342329324847473},{"x":0.31553918837357686,"y":0.4527452082787821},{"x":0.2833022943184472,"y":0.4556178027985462}]
    },
    "PENRITH_MOUNTAINS": {
        // Zermatt (https://en.wikipedia.org/wiki/Zermatt#Climate)
        tempMaxVar: 10,
        tempSummer: 56,
        tempWinter: 25,

        sun: 0.6,
        windAvg: 13,

        conditionDelay: 5.5,
        conditionsSummer: ["PRECIP", "PRECIP", "PRECIP", "WIND", "COLD"],
        conditionsWinter: ["PRECIP", "PRECIP", "PRECIP", "WIND", "COLD"] ,

        bounds: [{"x":1.0029419796096064,"y":0.8337625165901398},{"x":0.9553530609567742,"y":0.849727831234961},{"x":0.9166678754712458,"y":0.8844216880592839},{"x":0.9102203445569912,"y":0.9175804184754509},{"x":0.8706140832265694,"y":0.9274052274876486},{"x":0.84206073203487,"y":0.9522742752997739},{"x":0.7855680802147336,"y":0.9756081967037433},{"x":0.7481109958557299,"y":1.0023193962056558},{"x":1.0063192577075495,"y":1.0013983203607622},{"x":1.0370217858706672,"y":0.9065275083367286}]
    },
    "TEKHAN_SHORE": {
        // Woodward (https://weatherspark.com/y/6258/Average-Weather-in-Woodward-Oklahoma-United-States-Year-Round)
        tempMaxVar: 10,
        tempSummer: 83,
        tempWinter: 37,

        sun: 0.65,
        windAvg: 15,

        conditionDelay: 8.5,
        conditionsSummer: ["PRECIP", "PRECIP", "PRECIP", "COLD", "HOT"],
        conditionsWinter: ["PRECIP", "PRECIP", "FOG",    "COLD", "WIND"] ,

        bounds: [{"x":0.228194293848689,"y":0.535298921745431},{"x":0.21641735894023814,"y":0.5134769541209485},{"x":0.18177931509185336,"y":0.5082812475436909},{"x":0.13640347765046926,"y":0.5318351173605925},{"x":0.10800028169479368,"y":0.5387627261302694},{"x":0.0785579444236666,"y":0.5699369655938158},{"x":0.04114885706741099,"y":0.6004184441803945},{"x":0.017248606812025474,"y":0.6205085096124576},{"x":0.009628237165380804,"y":0.6471798033757139},{"x":0.01932688944292857,"y":0.72338349984216},{"x":0.044959041890733326,"y":0.7504011740439002},{"x":0.10696114037934215,"y":0.7330821521197077},{"x":0.13432519501956616,"y":0.6714264340695828},{"x":0.11977721660324453,"y":0.6371347706596817},{"x":0.14298470598166235,"y":0.611502618211877},{"x":0.16549943448311233,"y":0.5806747591868134},{"x":0.2313117177950435,"y":0.5661267807704918},{"x":0.2299261960411081,"y":0.5349525413069455}]
    },
    "TEKHAN": {
        // Quetta (https://weatherspark.com/y/106490/Average-Weather-in-Quetta-Pakistan-Year-Round)
        tempMaxVar: 15,
        tempSummer: 90,
        tempWinter: 80,

        sun: 0.75,
        windAvg: 8,

        conditionDelay: 10,
        conditionsSummer: ["STORM", "DRYSTORM", "WIND",  "WIND",     "WIND", "HOT",  "HOT", "HOT", "HOT"],
        conditionsWinter: ["STORM", "STORM", "DRYSTORM", "DRYSTORM", "WIND", "WIND", "HOT", "HOT", "HOT"],

        bounds: [{"x":0.13130927676405996,"y":0.6673679677541352},{"x":0.10173353996361566,"y":0.7268243458581212},{"x":0.03983792583485071,"y":0.7445088070377683},{"x":0.011176902543698491,"y":0.7658521222545838},{"x":0.014225947574672104,"y":0.7939033365395414},{"x":0.05996162303927677,"y":0.8170760787749409},{"x":0.11545424260299701,"y":0.8164662697687463},{"x":0.1505182604591939,"y":0.7829267744280362},{"x":0.23406209430787167,"y":0.7512167061059103},{"x":0.3093735065729206,"y":0.719201733280687},{"x":0.3102882200822127,"y":0.6862720469461717},{"x":0.29412828141805236,"y":0.6597453551767011},{"x":0.214243301606543,"y":0.6313892363886462},{"x":0.16545858111096473,"y":0.6368775174443988},{"x":0.13069946775786523,"y":0.6667581587479404}]
    },
    "TEKHAN_RED_WASTES": {
        // Death Valley (https://en.wikipedia.org/wiki/Death_Valley)
        // Sahara Desert (https://en.wikipedia.org/wiki/Sahara_desert_(ecoregion))
        tempMaxVar: 15,
        tempSummer: 120,
        tempWinter: 80,

        sun: 0.8,
        windAvg: 8,

        conditionDelay: 10,
        conditionsSummer: ["STORM", "DRYSTORM", "WIND",  "WIND", "HOT", "HOT", "HOT", "HOT", "HOT", "HOT"],
        conditionsWinter: ["STORM", "DRYSTORM", "WIND",  "WIND", "HOT", "HOT", "HOT", "HOT", "HOT", "HOT"],

        bounds: [{"x":0.1315145045988623,"y":0.8569980977887771},{"x":0.07398405174167086,"y":0.870395600508945},{"x":0.05349375346376703,"y":0.8522695674169533},{"x":0.03418558777881919,"y":0.8526636116146052},{"x":0.03654985296473115,"y":0.9153166390412726},{"x":0.056252062847331,"y":0.9275320091684846},{"x":0.13939538855190223,"y":0.9105881086694487},{"x":0.25090989648741724,"y":0.9235915671919646},{"x":0.2820393881019249,"y":0.9224094345990086},{"x":0.3293246918201645,"y":0.9062536224952767},{"x":0.3695171999806681,"y":0.8727598656948571},{"x":0.3923717634444839,"y":0.8199579432094896},{"x":0.35572565306284826,"y":0.8081366172799296},{"x":0.29189049304322484,"y":0.7245992473777064},{"x":0.14767031670259415,"y":0.7777952140607258}]
    },
    "TEKHAN_MOUNTAINS": {
        // Uyuni (https://weatherspark.com/y/27661/Average-Weather-in-Uyuni-Bolivia-Year-Round)
        tempMaxVar: 10,
        tempSummer: 70,
        tempWinter: 50,

        sun: 0.7,
        windAvg: 13,

        conditionDelay: 10,
        conditionsSummer: ["STORM", "DRYSTORM", "WIND",  "WIND",     "WIND", "HOT",  "HOT", "HOT", "HOT"],
        conditionsWinter: ["STORM", "STORM", "DRYSTORM", "DRYSTORM", "WIND", "WIND", "HOT", "HOT", "HOT"],
        
        bounds: [{"x":0.0558345970026429,"y":0.8487876262003264},{"x":0.08216566470125197,"y":0.8806298476032955},{"x":0.12625489433613224,"y":0.8919583302178135},{"x":0.1574847653275058,"y":0.9042053384497246},{"x":0.1911640379652616,"y":0.9017559368033424},{"x":0.2814857236756066,"y":0.9241067268265803},{"x":0.24780645103785087,"y":0.9724824093426295},{"x":0.1666700215014392,"y":0.9850355927803385},{"x":0.06287662673599184,"y":0.9519686705541783},{"x":0.03654555903738277,"y":0.9032868128323313},{"x":0.03225910615621386,"y":0.8503185022293154},{"x":0.05767164823742957,"y":0.8515432030525065}]
    },
    "TEKHAN_STORM": {
        tempMaxVar: 5,
        tempSummer: 85,
        tempWinter: 60,

        sun: 0.02,
        windAvg: 50,

        conditionDelay: 6.5,
        conditionsSummer: ["DRYSTORM", "DRYSTORM", "WIND", "WIND", "CEASE", "CEASE", "CEASE", "CEASE"],
        conditionsWinter: ["DRYSTORM", "DRYSTORM", "WIND", "WIND", "CEASE", "CEASE", "CEASE", "CEASE"], 

        bounds: [{"x":0.4276050742617221,"y":0.5964924603156955},{"x":0.3990866908475633,"y":0.6058867513227125},{"x":0.37560096333002074,"y":0.625346354122962},{"x":0.34473400716410774,"y":0.6609104557923836},{"x":0.2923943858392986,"y":0.6880867976341114},{"x":0.2873617299426824,"y":0.7296900863794724},{"x":0.353457277384909,"y":0.812561153477087},{"x":0.4027773051717483,"y":0.784378280456036},{"x":0.4524328433516954,"y":0.7494851995728299},{"x":0.4604850927862814,"y":0.6750018923029093}]
    },
    "VATICHI": {
        // Oslo winter (https://weatherspark.com/s/68697/3/Average-Winter-Weather-in-Oslo-Norway)
        tempMaxVar: 8,
        tempSummer: 25,
        tempWinter: 15,

        sun: 0.5,
        windAvg: 10,

        conditionDelay: 5.5,
        conditionsSummer: ["PRECIP", "PRECIP", "WIND", "NOOP", "WIND", "COLD", "COLD", "NORTHLIGHT"],
        conditionsWinter: ["PRECIP", "PRECIP", "PRECIP", "PRECIP", "WIND", "COLD", "COLD", "NORTHLIGHT"] ,

        bounds: [{"x":0.8841153058611619,"y":0.13702627196096073},{"x":0.8431979547812809,"y":0.2350658656375072},{"x":0.7889115682000527,"y":0.30191104314424344},{"x":0.7342200593309048,"y":0.2796293173086647},{"x":0.7309790810275479,"y":0.21237901751400884},{"x":0.7398917713617794,"y":0.10380624435155243},{"x":0.7609581303335994,"y":0.04911473548240461},{"x":0.8071420711564353,"y":0.028858621086423925},{"x":0.8091676825960333,"y":0.07706817334885793},{"x":0.8423877102054417,"y":0.10380624435155243}]

    },
    "VATICHI_WASTES": {
        // Karpogory winter (https://weatherspark.com/s/103632/3/Average-Winter-Weather-in-Karpogory-Russia)
        tempMaxVar: 10,
        tempSummer: 15,
        tempWinter: 5,

        sun: 0.65,
        windAvg: 15,

        conditionDelay: 5.5,
        conditionsSummer: ["PRECIP", "PRECIP", "WIND", "COLD", "CEASE", "NORTHLIGHT"],
        conditionsWinter: ["PRECIP", "PRECIP", "WIND", "COLD", "CEASE", "NORTHLIGHT"],

        bounds: [{"x":1.0034487757798576,"y":0.19542010548690616},{"x":0.8467542658467103,"y":0.22506501277155566},{"x":0.8819046559127948,"y":0.13782428561958718},{"x":0.807368889025676,"y":0.1196138425733025},{"x":0.7916994380323613,"y":0.08996893528865302},{"x":0.7883114486284014,"y":0.06074752667949852},{"x":0.8056748943236961,"y":0.029408624692869062},{"x":0.8632707141910151,"y":-0.0048947680222253265},{"x":1.0068367651838175,"y":-0.005318266697720342}]
    },
    "LAPHENA_WOODS": {
        // Finland winter (https://weatherspark.com/s/90427/3/Average-Winter-Weather-in-Tampere-Finland#Sections-Wind)
        tempMaxVar: 5,
        tempSummer: 30,
        tempWinter: 18,

        sun: 0.4,
        windAvg: 6,
        
        conditionDelay: 7,
        conditionsSummer: ["PRECIP", "PRECIP", "FOG", "FOG", "COLD", "NORTHLIGHT"],
        conditionsWinter: ["PRECIP", "PRECIP", "FOG", "FOG", "COLD", "NORTHLIGHT"] ,

        bounds: [{"x":0.4773312233715825,"y":0.17846545829271276},{"x":0.529072654492716,"y":0.21123503133609733},{"x":0.5373512834720975,"y":0.20640583109812488},{"x":0.5487343983187468,"y":0.14328128513034194},{"x":0.46353350840594687,"y":0.07498259605044565},{"x":0.412826905907236,"y":0.06842868144176874},{"x":0.34556304544976235,"y":0.09222973975749016},{"x":0.29865081456660125,"y":0.1381071420182286},{"x":0.24311501182991793,"y":0.13258805603197435},{"x":0.24345995470405882,"y":0.1767407439220083},{"x":0.2576026125438353,"y":0.22537768917587384},{"x":0.27553964199916164,"y":0.25021357611401795},{"x":0.2914070142096426,"y":0.2584922050933993},{"x":0.3138283010288005,"y":0.2633214053313718},{"x":0.3400439594635081,"y":0.24710909024674993},{"x":0.3841966473535421,"y":0.2364158611483823},{"x":0.42214036350904005,"y":0.20364628810499774},{"x":0.45973913679039713,"y":0.1912283446359257}]
    },
    "LAPHENA_MOUNTAINS": {
        // South Pole (https://en.wikipedia.org/wiki/South_Pole)
        tempMaxVar: 25,
        tempSummer: -30,
        tempWinter: -70,

        sun: 0.5,
        windAvg: 40,

        conditionDelay: 4,
        conditionsSummer: ["PRECIP", "PRECIP", "COLD", "COLD", "HOT", "WIND", "WIND", "CEASE"],
        conditionsWinter: ["PRECIP", "PRECIP", "COLD", "COLD", "HOT", "WIND", "WIND", "CEASE"],

        bounds: [{"x":-0.0110418878781392,"y":0.09852897433867519},{"x":0.057518925399779375,"y":0.1127585770944696},{"x":0.12435493834366221,"y":0.10154737492323763},{"x":0.1454837424355994,"y":0.07696897016322912},{"x":0.20240215345877702,"y":0.10801537617587147},{"x":0.2450909617261603,"y":0.13518098143693352},{"x":0.3007157724988112,"y":0.14208018277307627},{"x":0.345560581183739,"y":0.09551057375411273},{"x":0.4136901943781487,"y":0.07179456916112205},{"x":0.46414060414869246,"y":0.0786937704972648},{"x":0.5460686200153877,"y":0.14596098352465658},{"x":0.5676286241908337,"y":0.1537225850278172},{"x":0.6072990318736545,"y":0.1127585770944696},{"x":0.6504190402245467,"y":0.05066576506918488},{"x":0.692676648408421,"y":-0.005821445870483846},{"x":-0.0058674868760321686,"y":-0.010133446705573076},{"x":-0.00241788620796074,"y":0.09249217316955027}]
    },
    "LAPHENA_WASTES": {
        // Halley Research Station (https://en.wikipedia.org/wiki/Halley_Research_Station)
        tempMaxVar: 15,
        tempSummer: -10,
        tempWinter: -30,

        sun: 0.6,
        windAvg: 15,

        conditionDelay: 7,
        conditionsSummer: ["PRECIP", "WIND", "WIND", "COLD", "NORTHLIGHT"],
        conditionsWinter: ["PRECIP", "WIND", "WIND", "COLD", "NORTHLIGHT"],

        bounds: [{"x":0.12659327109213048,"y":0.08948930034900648},{"x":0.1582145427466459,"y":0.13452565694786187},{"x":0.1352172542706347,"y":0.17716646266379943},{"x":0.19318958563724636,"y":0.18674866619547079},{"x":0.21474954358350698,"y":0.22699392102849048},{"x":0.25212013735702526,"y":0.24232544667916467},{"x":0.23056017941076465,"y":0.2576569723298388},{"x":0.16923407680806798,"y":0.2844871422185186},{"x":0.09401377908444783,"y":0.276342269216598},{"x":0.0255010238329976,"y":0.3175457444027848},{"x":-0.007557578351268551,"y":0.31419197316669983},{"x":-0.005162027468350705,"y":0.0971550631743436},{"x":0.0571222954875131,"y":0.11009103794209993},{"x":0.12323949985604549,"y":0.0971550631743436},{"x":0.144799457802306,"y":0.0731995543451652}]
    },
    "DAWNSPIRE": {
        tempMaxVar: 5,
        tempSummer: 90,
        tempWinter: 70,

        sun: 0.999,
        windAvg: 25,

        conditionDelay: 4,
        conditionsSummer: ["FLARE", "NOOP", "NOOP"],
        conditionsWinter: ["FLARE", "NOOP", "NOOP"],

        bounds: [{"x":0.6450869484375721,"y":0.40551998836263475},{"x":0.63617473190735,"y":0.42417994172278717},{"x":0.645643961970711,"y":0.44478944244892565},{"x":0.6631898882645856,"y":0.4511950980800228},{"x":0.6815713348581686,"y":0.44395392214921736},{"x":0.6913190716880989,"y":0.42417994172278717},{"x":0.6874199769561268,"y":0.4085835627948986},{"x":0.66597495593028,"y":0.3957722515327044}]
    }
}

/*
TEMP
<-40
All liquids freeze within 1 hours unless actively heated

-40 - -10
liquids freeze after 1 day unless acively headted

<-40
40-10
polar (-40-(-10))
frigid (-10-10)
freezing (10-32)
cold (32-45)
cool (45-60)
warm (60-80)
hot (80-100)
scorching (100-125)

HUMIDITY
Arid (<10)
Dry (10-30)
Comfortable (30-60)
Humid (60-80)
Moist (>80)

PRECIP
rain / snow / freezing rain
storm / thunderstorm / blizzard / sandstorm

CLOUDS
clear (0-10)
clouds (10-60)
overcast (100)

FOG
yes
no

WIND
calm (0-10)
windy (10-30)
strong (30-50)
gale (50-80)
torrential (80+)

zone -> temp
zone, temp -> clouds, precip, fog
zone, temp, precip -> humidity
zone, precip -> wind
*/

function getTodaysWeather(zone, arc) {
    return getForecast(zone, arc, NORToLocal(now, arc), 1);
}

function getForecast(zone, arc, dt, days) {
    let wz = weatherZones[zone];
    let forecast = []

    let cs = conditionByRange(zone, dt, dt + days + 1, arc);
    let csi = 0;    

    for (let hour = 0; hour < 24 * days; hour += 2) {
        let startTime = Math.floor(dt) + hour / 24;
        let cTime = startTime + 1 / 24;
        let h = Math.floor(startTime * 6);

        let summerness = getSummerness(cTime);
        let tempMean = lerp(wz.tempWinter, wz.tempSummer, summerness);

        // Scan to current conditions by skipping any past conditions. Assumes that conditions are ordered and not overlapping.
        while (cs[csi].end < cTime) {
            csi += 1;
        }
        let condition = cs[csi];
        let code = condition.code;

        // If the sun is broken, it will be stuck at whatever state it was when it broke
        let lighting = getLighting(code == "SUNBROKE" ? condition.start : cTime, arc);
        let light = {day: 1, night: 0, dawn: 0.5, dusk: 0.5}[lighting] * 0.6;
        light += {day: 1, night: 0, dawn: 0.5, dusk: 0.5}[getLighting(cTime - 1 / 24, arc)] * 0.3;
        light += {day: 1, night: 0, dawn: 0.5, dusk: 0.5}[getLighting(cTime - 3 / 24, arc)] * 0.1;

        let tempBase = tempMean + light * wz.tempMaxVar;

        let temp = tempBase + (smoothHash(h, 8, 10) * 2 - 1) * wz.tempMaxVar * 2;
    
        let sunnyness = denorm(smoothHash(h, 12, 20), 8);
        let c = 1 - wz.sun;
        let clouds = smoothClamp(0.5 / Math.min(c, 1-c) * (c - sunnyness) + 0.5 - Math.pow(1 - c, 3));

        // TODO Lightning that can strike players
        // TODO allow players to forecast the weather. At first they'll have to pay for weather information, later they can use a divination magic
        //      artifact to help them that gives limited foresight (know the type of weather that's next but not when)
    
        let wind = Math.max(0, wz.windAvg * (1 + (smoothHash(h, 8, 30) - 0.5) * 3));

        // APPLY CONDITIONS

        if (code == "PRECIP") {
            code = temp > 32 ? "RAIN" : "SNOW";
        }
        if (code == "STORM") {
            code = temp > 32 ? "THUNDER" : "BLIZZARD";
        }
        if (code == "FLARE" && light < 0.2) {
            code = "CALM";
        }

        if (code == "FOG") {
            wind *= 0.5;
            clouds = 1;
            temp = lerp(temp, 32, 0.15);
        } else if (code == "RAIN") {
            clouds = 1;
            temp = lerp(temp, 32, 0.2);
        } else if (code == "SNOW") {
            clouds = 1;
        } else if (code == "THUNDER") {
            clouds = 1;
            wind = wind * 1.5 + 20;
            temp = lerp(temp, 32, 0.2);
        } else if (code == "BLIZZARD") {
            clouds = 1;
            wind = wind * 1.5 + 20;
        } else if (code == "COLD") {
            temp -= 15;
            clouds = Math.pow(clouds, 2);
        } else if (code == "HOT") {
            temp += 15;
            clouds = Math.pow(clouds, 2);
        } else if (code == "WIND") {
            wind = wind * 1.5 + 30;
        } else if (code == "DRYSTORM") {
            clouds = 1;
            wind = wind * 1.5 + 20;
        } else if (code == "NORTHLIGHT") {
            clouds *= 0.3;
            temp = lerp(temp, 25, 0.4);
            wind *= 0.2;
        } else if (code == "ASH") {
            clouds = 1;
            temp += 10;
        } else if (code == "ERUPT") {
            clouds = 1;
            temp += 35;
            wind += 10;
        } else if (code == "CEASE") {
            clouds = 0;
            temp = lerp(temp, 50, 0.6);
            wind *= 0.2;
        } else if (code == "FLARE") {
            let intensity = hash(h, 100) * light;
            temp += (intensity + 0.5) * 60;
            wind += (intensity + 0.5) * 25;
        }

        let windChill = 35.74 + 0.6215 * temp - 35.75 * Math.pow(wind + 1, 0.16) + 0.4275 * temp * Math.pow(wind + 1, 0.16);
        windChill = Math.min(windChill, temp);
        let color = conditions[code].color;

        forecast.push({
            timeS: formatDateTimeShort(startTime),
            condition: code,
            temp: Math.round(temp / 5) * 5,
            windChill: Math.round(windChill / 5) * 5,
            wind: Math.round(wind / 5) * 5,
            clouds: Math.round(clouds * 5) / 5,
            time: startTime,
            lighting,
            color
        });
    }

    return forecast
}


/*

Precip is hard to handle as a smoothly moving float. Yes, it's more realistic, but it adds unnecessary complexity and limits the ways that it can be used. 
Ideally, we'd want to have hard rules like 25% of the time rain is thunderstorms. But if we say that precip > 0.75 -> thunder, then it'll have to move from rain to
thunder, and then back. That's not terrible, but it means we cannot use this system for anything other than varying intensities of rain. We may want windstorms, fog, or
more exotic conditions.

Most games get away with a much simpler system with a random condition picked from a weighted pool, then that condition stays for a random period of time before going
back to calm weather for another random period. This makes it much more predictable and avoids simulating dozens of different mechanisms simulataneously.

In the weather system, a number of different conditions are defined:
dur   | code       descr
------|----------- DEFAULT ------------------------
---   | CALM       calm / cloudy / overcast (always follows other condition, lasts anywhere from 0.5 days to 2*conditionDelay
1-2   | SUNBROKE   dawnspire broke at whatever state it was at the beginnning of the condition (happens 1% of days)
------|----------- AVAILABLE ----------------------
0     | NOOP       do nothing, continue with CALM.
.25-1 | FOG        fog
.5-3  | PRECIP     rain or snow
1-3   | COLD       cold snap
1-3   | HOT        heat wave
.5-1.5| WIND       windstorm
.5    | DRYSTORM   dry storm
.5    | NORTHLIGHT northern lights, 50% chance to become NOOP
2-3   | ASH        Volcanic Ash
.5-1  | CEASE      Any persistent winds die down
.25-.5| FLARE      Dawnspire flare, a more violent heat wave, half as strong at dawn/dusk and becomes NOOP at night
------|----------- DERIVED ------------------------
.25   | ERUPT      Volcanic Eruption, ASH has a 25% chance of becoming ERUPT
.5-3  | RAIN       rains when PRECIP happens above 32 degrees
.5-3  | SNOW       snows when PRECIP happens below 32 degrees
.5-2  | STORM      PRECIP has a 25% chance of becoming a STORM
.5-2  | BLIZZ      STORM happens below 32 degrees
.5-2  | THUNDR     STORM happens above 32 degrees



Each biome can then list which ones are eligible in the area. These are chosen at random, so weighting should be done by duplicating entries in the list.

We need a way to deterministically tell which thing comes next, this can be tricky due to the timeouts and cycles at play here. 
The system resets at the start of a calm cycle which helps a bit, but knowing where that is can be difficult without having a fixed start date.

One option is to say the start date is always the start of the year, this means that all weather conditions will reset at the end of the year, but I can live with that.
*/

conditions = {
    CALM: {
        color: "#55AADD"
    },
    SUNBROKE: {
        durMin: 1,
        durMax: 2,
        color: "#AA8833"
    },
    NOOP: {
        durMin: 0,
        durMax: 0
    },
    FOG: {
        durMin: 0.25,
        durMax: 1,
        color: "#AABBC4"
    },
    PRECIP: {
        durMin: 0.5,
        durMax: 3,
    },
    RAIN: {
        color: "#5577AA"
    },
    SNOW: {
        color: "#88AABB"
    },
    STORM: {
        durMin: 0.5,
        durMax: 1.5,
    },
    THUNDER: {
        color: "#335588"
    },
    BLIZZARD: {
        color: "#88CCDD"
    },
    COLD: {
        durMin: 1,
        durMax: 3,
        color: "#66AACC"
    },
    HOT: {
        durMin: 1,
        durMax: 3,
        color: "#CC6622"
    },
    WIND: {
        durMin: 0.5,
        durMax: 1.5,
        color: "#99AABB"
    },
    DRYSTORM: {
        durMin: 0.5,
        durMax: 0.75,
        color: "#885533"
    },
    NORTHLIGHT: {
        durMin: 0.5,
        durMax: 0.75,
        color: "#4433DD"
    },
    ASH: {
        durMin: 2,
        durMax: 3,
        color: "#443333"
    },
    ERUPT: {
        durMin: 0.25,
        durMax: 0.25,
        color: "#EE4422"
    },
    CEASE: {
        durMin: 0.5,
        durMax: 1,
        color: "#333844"
    },
    FLARE: {
        durMin: 0.25,
        durMax: 0.5,
        color: "#F30"
    }
}

// Get conditions within a calendar year. Year always starts calm, and any conditions that extend past the end of the year
// are clipped so they end at the start of the next year. This ensures that each year is independent.
// times are all NOR, so they will need to be converted to local times.
function conditionByYear(zone, year) {
    let yearStart = year * 200;
    let yearEnd = yearStart + 200;

    let now = yearStart;
    let cs = [];

    let wz = weatherZones[zone];

    while (now < yearEnd) {
        let calmEnd = Math.min(yearEnd, now + wz.conditionDelay * (0.5 + hash(now, 18123)));

        cs.push({
            start: now,
            end: calmEnd,
            code: "CALM",
        });

        now = calmEnd;
        if (now >= yearEnd) {
            break;
        }

        let conditionCode;
        let summerness = getSummerness(now);
        if (hash(now, 18124) < summerness) {
            conditionCode = hashPick(now, 18125, wz.conditionsSummer);
        } else {
            conditionCode = hashPick(now, 18126, wz.conditionsWinter);
        }

        // CONDTION CODE TRANSFORMS

        // 1% chance per day of the dawnspire breaking, delay + 2 is roughly the number of days per iteration of the while loop, assuming 2 days per condition
        if (hash(now, 18128) < 1 - Math.pow(1 - 0.01, wz.conditionDelay + 2)) {
            conditionCode = "SUNBROKE";
        }
        if (conditionCode == "ASH" && hash(now, 18129) < 0.25) {
            conditionCode = "ERUPT";
        }
        if (conditionCode == "PRECIP" && hash(now, 128130) < 0.25) {
            conditionCode = "STORM";
        }
        // This just exists so that northern lights can be rare, without having to pad out the condition lists
        if (conditionCode == "NORTHLIGHT" && hash(now, 128131) < 0.5) {
            conditionCode = "NOOP";
        }

        if (conditionCode == "NOOP") {
            continue;
        }

        let condition = conditions[conditionCode];
        if (!condition) {
            console.error("UNKNOWN CONDITION " + conditionCode);
            return [];
        }
        let conditionEnd = Math.min(yearEnd, now + (hash(now, 18127) * condition.durMax - condition.durMin) + condition.durMin);

        cs.push({
            start: now,
            end: conditionEnd,
            code: conditionCode
        });

        now = conditionEnd;
    }

    return cs;
}

function conditionByRange(zone, dt1, dt2, arc) {
    let year1 = getYear(localToNOR(dt1, arc));
    let year2 = getYear(localToNOR(dt2, arc));

    c = [];
    for (let y = year1; y <= year2; y++) {
        c = [...c, ...conditionByYear(zone, y)];
    }
    c = c.map(i => ({start: NORToLocal(i.start, arc), end: NORToLocal(i.end, arc), code: i.code}));
    return c.filter(v => dt1 < v.end && v.start < dt2);
}

function getZoneFromPoint(x, y) {
    // In the event of an overlap, this algorithm prioirtizes the last zone in the list.
    // Instead of iterating from end to front, we'll just reverse the list.
    let zones = [...Object.entries(weatherZones)].reverse();

    for (let [name, zone] of zones) {
        let b = zone.bounds;

        let inside = false;
        for (let i = 0; i < b.length; i++) {
            let p0 = b[i];
            let p1 = b[(i + 1) % b.length];

            if (p0.y > y != p1.y > y &&
                (x < (p1.x - p0.x) * (y-p0.y) / (p1.y - p0.y) + p0.x)) {
                inside = !inside;
            }
        }

        if (inside) {
            return name;
        }
    }

    console.warn("Could not find a zone matching " + x + ", " + y + ". Returning OCEAN")
    return "OCEAN";
}

function getSummerness(dt) {
    let day = getDayOfYear(dt);
    return (Math.sin(TAU * (day - 25) / 200) + 1) / 2;
}

function lerp(a, b, t) {
    return a * (1 - t) + b * t; 
}

function clamp(x) {
    return Math.max(0, Math.min(1, x));
}

function smoothClamp(x) {
    x = clamp(x);
    return 3 * x * x - 2 * x * x * x;
}

// Generates a "random" number deterministically from v and i. If either are changed, a different number is generated
// A general usage is hash(today, 3) to get the third random propoerty for today.
// v: typically a dt, the floor of v is always used in the hash.
// i: typically an int, allows for multiple hashed values to be generated from a single dt
function hash(v, i) {
    v = Math.floor(v);
    // Scramble the seed based on v and i. Not mathematically rigorous by any stretch, but should work well enough.
    let seed = Math.abs(Math.floor(93742 * Math.sin(v * 5039 + i * Math.E * 731)));

    var t = seed + 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

// vLast: the last hash to evaluate a moving average over
// s: the size of the window to calculate the average
// i: the "seed" for the random generator. 
function smoothHash(vLast, s, i) {
    let h = 0;
    for (let d = 0; d < s; d++) {
        h += hash(Math.floor(vLast) - d, i);
    }
    return h / s;
}

// Roughly convert a normally distributed random hash (from smoothHash) to a 
// uniform one. q is how focused the data is around 0.5. This could be computed
// rigorously but I can't be bothered. Tweak it until things looks right. 
// q = s*2/3 seems to work pretty well.
function denorm(hash, q) {
    hash -= 0.5;
    hash *= q;
    return 1 / (1 + Math.exp(-2.4 * hash));
}

// Pick from a "random" item from l by hashing v and i
function hashPick(v, i, l) {
    return l[Math.floor(hash(v, i) * l.length)];
}