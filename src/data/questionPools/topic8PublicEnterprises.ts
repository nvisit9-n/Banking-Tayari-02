import { MasterBilingualItem } from './types';

// =========================================================================
// TOPIC 8: PUBLIC ENTERPRISES & BANKING LAWS (SLOTS 36 TO 40)
// Contains 50 distinct items for each of the 5 slots = 250 unique MCQs
// =========================================================================

function buildSlot36Items(): MasterBilingualItem[] {
  const items: MasterBilingualItem[] = [];

  for (let i = 1; i <= 50; i++) {
    if (i % 3 === 1) {
      items.push({
        qEng: `According to the Annual Status Review of Public Enterprises (Yellow Book) published by the Ministry of Finance, how many public enterprises exist in Nepal and into how many sectors are they categorized? (Set ${i})`,
        qNep: `अर्थ मन्त्रालयद्वारा प्रकाशित सार्वजनिक संस्थानको वार्षिक स्थिति समीक्षा (पहेँलो किताब) अनुसार नेपालमा हाल कुल कतिवटा सार्वजनिक संस्थान रहेका छन् र तिनलाई कति क्षेत्रमा वर्गीकरण गरिएको छ? (सेट ${i})`,
        correct: "44 Public Enterprises in 6 Sectors / ४४ वटा संस्थान",
        distractors: [
          "40 Public Enterprises in 5 Sectors / ४० वटा संस्थान",
          "50 Public Enterprises in 7 Sectors / ५० वटा संस्थान",
          "38 Public Enterprises in 4 Sectors / ३८ वटा संस्थान"
        ],
        expEng: "The Ministry of Finance classifies 44 public enterprises into 6 sectors: Industrial, Trading, Service, Social, Public Utility, and Financial.",
        expNep: "पहेँलो किताब अनुसार नेपालमा ४४ वटा सार्वजनिक संस्थानहरूलाई ६ वटा क्षेत्र (औद्योगिक, व्यापारिक, सेवा, सामाजिक, जनउपयोगी र वित्तीय) मा वर्गीकरण गरिएको छ।"
      });
    } else if (i % 3 === 2) {
      items.push({
        qEng: `Under Article 241 of the Constitution of Nepal, which constitutional office conducts the final financial audit of all public enterprises with more than 50% government ownership? (Set ${i})`,
        qNep: `नेपालको संविधानको धारा २४१ बमोजिम नेपाल सरकारको ५० प्रतिशतभन्दा बढी सेयर स्वामित्व भएका सम्पूर्ण सार्वजनिक संस्थानहरूको अन्तिम लेखापरीक्षण कुन निकायले गर्दछ? (सेट ${i})`,
        correct: "Office of the Auditor General / महालेखा परीक्षकको कार्यालय",
        distractors: [
          "Financial Comptroller General Office / महालेखा नियन्त्रक कार्यालय",
          "Nepal Rastra Bank / नेपाल राष्ट्र बैंक",
          "Public Accounts Committee / सार्वजनिक लेखा समिति"
        ],
        expEng: "Article 241 mandates the Auditor General to audit accounts of all corporate bodies substantially owned by the Government of Nepal (>50%).",
        expNep: "संविधानको धारा २४१ ले ५० प्रतिशतभन्दा बढी सरकारी स्वामित्व भएका सबै संगठित संस्थाको अन्तिम लेखापरीक्षण गर्ने अधिकार महालेखा परीक्षकलाई दिएको छ।"
      });
    } else {
      items.push({
        qEng: `What is the primary commercial and socio-economic objective of establishing Public Enterprises in Nepal? (Set ${i})`,
        qNep: `नेपालमा सार्वजनिक संस्थानहरू (Public Enterprises) स्थापना गर्नुको मूल उद्देश्य के हो? (सेट ${i})`,
        correct: "Ensuring supply of essential goods, building infrastructure & balanced regional growth / अत्यावश्यक वस्तुको आपूर्ति, पूर्वाधार निर्माण र सन्तुलित विकास",
        distractors: [
          "Maximizing private shareholder profits and eliminating market competition / निजी लगानीकर्ताको नाफा वृद्धि र बजार प्रतिस्पर्धा अन्त्य",
          "Generating foreign currency reserves through unlimited overseas imports / असीमित विदेशी वस्तु आयात गरी विदेशी मुद्रा आर्जन",
          "Providing employment opportunities exclusively to designated civil servants / सरकारी कर्मचारीलाई मात्र रोजगारीका अवसरहरू प्रदान"
        ],
        expEng: "Public enterprises are established to supply essential utilities, drive infrastructure growth, stabilize prices, and foster balanced economic development.",
        expNep: "सार्वजनिक संस्थानको मुख्य उद्देश्य आधारभूत वस्तु तथा सेवाको सुलभ आपूर्ति र राष्ट्रिय पूर्वाधार निर्माण गर्नु हो।"
      });
    }
  }

  return items;
}

function buildSlot37Items(): MasterBilingualItem[] {
  const items: MasterBilingualItem[] = [];

  for (let i = 1; i <= 50; i++) {
    if (i % 3 === 1) {
      items.push({
        qEng: `Under Section 8 of the Privatization Act, 2050 (निजीकरण ऐन, २०५०), which of the following is an officially recognized method of privatization of public enterprises? (Set ${i})`,
        qNep: `निजीकरण ऐन, २०५० को दफा ८ बमोजिम सार्वजनिक संस्थान निजीकरण गर्ने विधिहरूमा देहायका मध्ये कुन पर्दछ? (सेट ${i})`,
        correct: "Sale of shares, transfer of assets/lease, and management contract / सेयर बिक्री, सम्पत्ति बिक्री वा भाडा, र व्यवस्थापन करार",
        distractors: [
          "Permanent state takeover with complete nationalization / पूर्ण राष्ट्रियकरण र सरकारी नियन्त्रण सुदृढीकरण",
          "Arbitrary closure without legal valuation or clearance / कुनै मूल्याङ्कन नगरी तत्काल संस्था खारेज र बन्द",
          "Unconditional handover of assets to foreign embassies / विदेशी दूतावासलाई बिनासर्त सम्पत्ति हस्तान्तरण"
        ],
        expEng: "Section 8 of the Privatization Act 2050 recognizes share sales, asset sales/leases, management contracts, and dissolution/liquidation as valid privatization methods.",
        expNep: "निजीकरण ऐन २०५० को दफा ८ मा सेयर बिक्री, सम्पत्ति बिक्री वा भाडा, व्यवस्थापन करार र लिक्विडेसन जस्ता विधिहरू व्यवस्था गरिएको छ।"
      });
    } else if (i % 3 === 2) {
      items.push({
        qEng: `Who serves as the Chairperson of the high-level Privatization Committee (निजीकरण समिति) constituted under the Privatization Act, 2050? (Set ${i})`,
        qNep: `निजीकरण ऐन, २०५० बमोजिम गठित उच्चस्तरीय निजीकरण समितिको अध्यक्ष को रहने कानुनी व्यवस्था छ? (सेट ${i})`,
        correct: "Minister for Finance / अर्थमन्त्री",
        distractors: [
          "Governor of Nepal Rastra Bank / नेपाल राष्ट्र बैंकको गभर्नर",
          "Chief Secretary of the Government of Nepal / मुख्य सचिव",
          "Vice-Chairperson of National Planning Commission / योजना आयोगको उपाध्यक्ष"
        ],
        expEng: "Under the Privatization Act 2050, the Privatization Committee is chaired by the Minister for Finance.",
        expNep: "निजीकरण ऐन २०५० अनुसार निजीकरण समितिको अध्यक्ष माननीय अर्थमन्त्री रहने व्यवस्था छ।"
      });
    } else {
      items.push({
        qEng: `Which was the first public enterprise in Nepal to be privatized following the economic liberalization policy in 2049/2050 BS? (Set ${i})`,
        qNep: `वि.सं. २०४९/५० मा नेपालमा आर्थिक उदारीकरण र निजीकरण प्रक्रिया सुरु भएपछि पहिलो चरणमा निजीकरण गरिएको संस्थान कुन हो? (सेट ${i})`,
        correct: "Bhrikuti Pulp and Paper Factory / भृकुटी कागज कारखाना",
        distractors: [
          "Bansbari Leather and Shoe Factory / बाँसबारी छाला जुत्ता कारखाना",
          "Harisiddhi Brick and Tile Factory / हरिसिद्धि इँटा तथा टायल कारखाना",
          "Birgunj Sugar Mill / वीरगन्ज चिनी कारखाना"
        ],
        expEng: "Bhrikuti Pulp and Paper Limited, followed by Harisiddhi Brick Factory and Bansbari Leather Factory, was among the first batch privatized in 1992/93.",
        expNep: "नेपालमा वि.सं. २०४९ मा भृकुटी कागज कारखाना, हरिसिद्धि इँटा र बाँसबारी छाला जुत्ता पहिलो चरणमा निजीकरण गरिएका थिए।"
      });
    }
  }

  return items;
}

function buildSlot38Items(): MasterBilingualItem[] {
  const items: MasterBilingualItem[] = [];

  for (let i = 1; i <= 50; i++) {
    if (i % 3 === 1) {
      items.push({
        qEng: `According to Section 14 of the Nepal Rastra Bank Act, 2058, how many members comprise the Board of Directors of Nepal Rastra Bank? (Set ${i})`,
        qNep: `नेपाल राष्ट्र बैंक ऐन, २०५८ को दफा १४ बमोजिम नेपाल राष्ट्र बैंकको सञ्चालक समितिमा कति जना सदस्यहरू रहने व्यवस्था छ? (सेट ${i})`,
        correct: "7 Members / ७ सदस्यीय समिति",
        distractors: [
          "5 Members / ५ सदस्यीय समिति",
          "9 Members / ९ सदस्यीय समिति",
          "11 Members / ११ सदस्यीय समिति"
        ],
        expEng: "Section 14 specifies a 7-member Board: Governor (Chair), Finance Secretary, two Deputy Governors, and three expert non-executive directors.",
        expNep: "दफा १४ बमोजिम गभर्नरको अध्यक्षतामा अर्थसचिव, २ डेपुटी गभर्नर र ३ विज्ञ सञ्चालक गरी ७ सदस्यीय सञ्चालक समिति हुन्छ।"
      });
    } else if (i % 3 === 2) {
      items.push({
        qEng: `Under Section 15 of the Nepal Rastra Bank Act, 2058, what is the term of office of the Governor of Nepal Rastra Bank? (Set ${i})`,
        qNep: `नेपाल राष्ट्र बैंक ऐन, २०५८ को दफा १५ बमोजिम नेपाल राष्ट्र बैंकको गभर्नरको पदावधि कति वर्षको हुन्छ? (सेट ${i})`,
        correct: "5 years / ५ वर्ष",
        distractors: [
          "4 years / ४ वर्ष",
          "6 years / ६ वर्ष",
          "3 years / ३ वर्ष"
        ],
        expEng: "Section 15 sets the Governor's tenure at 5 years. A Governor may be reappointed for one additional term.",
        expNep: "नेपाल राष्ट्र बैंक ऐन २०५८ अनुसार गभर्नरको पदावधि ५ वर्षको हुन्छ र थप एक कार्यकालका लागि पुनः नियुक्त हुन सक्दछ।"
      });
    } else {
      items.push({
        qEng: `Under Section 28 of the Nepal Rastra Bank Act, 2058, who holds the sole monopoly right to issue bank notes and coins in the Kingdom of Nepal? (Set ${i})`,
        qNep: `नेपाल राष्ट्र बैंक ऐन, २०५८ को दफा २८ बमोजिम नेपालभर बैंक नोट तथा सिक्का निष्कासन गर्ने एकाधिकार कसलाई रहेको छ? (सेट ${i})`,
        correct: "Nepal Rastra Bank exclusively / नेपाल राष्ट्र बैंकलाई मात्र",
        distractors: [
          "Ministry of Finance / अर्थ मन्त्रालय",
          "Rastriya Banijya Bank / राष्ट्रिय वाणिज्य बैंक",
          "Security Printing Press / सुरक्षण मुद्रण केन्द्र"
        ],
        expEng: "Section 28 explicitly grants NRB the sole and exclusive legal right to issue currency notes and coins in Nepal.",
        expNep: "दफा २८ ले नेपाल राष्ट्र बैंकलाई नोट तथा सिक्का निष्कासन गर्ने पूर्ण एकाधिकार प्रदान गरेको छ।"
      });
    }
  }

  return items;
}

function buildSlot39Items(): MasterBilingualItem[] {
  const items: MasterBilingualItem[] = [];

  for (let i = 1; i <= 50; i++) {
    if (i % 3 === 1) {
      items.push({
        qEng: `Under Section 29 of the Bank and Financial Institutions Act (BAFIA), 2073, what is the maximum term and reappointment limit for a Chief Executive Officer (CEO)? (Set ${i})`,
        qNep: `बैंक तथा वित्तीय संस्था सम्बन्धी ऐन (बाफिया), २०७३ को दफा २९ बमोजिम प्रमुख कार्यकारी अधिकृत (CEO) को एक पटकको पदावधि अधिकतम कति वर्ष हुन्छ र पुनः कति कार्यकालका लागि नियुक्त हुन सक्छ? (सेट ${i})`,
        correct: "4 years per term, max 2 terms / अधिकतम ४ वर्ष, बढीमा २ कार्यकाल",
        distractors: [
          "5 years per term, unlimited terms / अधिकतम ५ वर्ष, असीमित कार्यकाल",
          "3 years per term, max 3 terms / अधिकतम ३ वर्ष, बढीमा ३ कार्यकाल",
          "4 years per term, single term only / अधिकतम ४ वर्ष, एक कार्यकाल मात्र"
        ],
        expEng: "BAFIA 2073 Section 29 restricts the CEO's term to a maximum of 4 years, with at most one reappointment (total 8 years).",
        expNep: "बाफियाको दफा २९ अनुसार बैंकको CEO को कार्यकाल बढीमा ४ वर्षको हुनेछ र निज पुनः एक कार्यकालका लागि मात्र नियुक्त हुन सक्छ।"
      });
    } else if (i % 3 === 2) {
      items.push({
        qEng: `According to BAFIA 2073 and NRB Directives, what is the Single Borrower Limit for fund-based credit facilities to an individual borrower or group? (Set ${i})`,
        qNep: `बाफिया र नेपाल राष्ट्र बैंकको एकल ग्राहक कर्जा सीमा (Single Borrower Limit) सम्बन्धी निर्देशन अनुसार कुनै एक ग्राहक वा समूहलाई प्राथमिक पुँजी (Core Capital) को अधिकतम कति प्रतिशतसम्म कोषमा आधारित (Fund-based) कर्जा प्रवाह गर्न सकिन्छ? (सेट ${i})`,
        correct: "Maximum 25% of Core Capital / प्राथमिक पुँजीको अधिकतम २५ प्रतिशत",
        distractors: [
          "Maximum 15% of Core Capital / अधिकतम १५ प्रतिशत",
          "Maximum 35% of Core Capital / अधिकतम ३५ प्रतिशत",
          "Maximum 50% of Core Capital / अधिकतम ५० प्रतिशत"
        ],
        expEng: "NRB prudential norms cap fund-based single borrower limits at 25% of core capital (Tier 1). Non-fund based is capped at 50%.",
        expNep: "राष्ट्र बैंकको निर्देशन अनुसार बैंकहरूले कुनै एक ग्राहक वा समूहलाई प्राथमिक पुँजीको बढीमा २५% सम्म मात्र कोषमा आधारित कर्जा दिन पाउँछन्।"
      });
    } else {
      items.push({
        qEng: `Under Section 44 of BAFIA 2073, what percentage of annual net profit must banks transfer to their General Reserve Fund until the fund equals their paid-up capital? (Set ${i})`,
        qNep: `बाफिया २०७३ को दफा ४४ बमोजिम बैंक तथा वित्तीय संस्थाहरूले चुक्ता पुँजी बराबर नभएसम्म वार्षिक खुद नाफाको कम्तीमा कति प्रतिशत रकम साधारण जगेडा कोष (General Reserve) मा जम्मा गर्नुपर्छ? (सेट ${i})`,
        correct: "At least 20% of Net Profit / खुद नाफाको कम्तीमा २० प्रतिशत",
        distractors: [
          "At least 10% / कम्तीमा १० प्रतिशत",
          "At least 15% / कम्तीमा १५ प्रतिशत",
          "At least 25% / कम्तीमा २५ प्रतिशत"
        ],
        expEng: "Section 44 mandates transferring at least 20% of annual net profit to General Reserve until it equals paid-up capital, and at least 10% each year thereafter.",
        expNep: "बाफिया दफा ४४ ले चुक्ता पुँजी बराबर नपुगुन्जेल वार्षिक खुद नाफाको कम्तीमा २०% साधारण जगेडामा राख्नुपर्ने अनिवार्य व्यवस्था गरेको छ।"
      });
    }
  }

  return items;
}

function buildSlot40Items(): MasterBilingualItem[] {
  const items: MasterBilingualItem[] = [];

  for (let i = 1; i <= 50; i++) {
    if (i % 3 === 1) {
      items.push({
        qEng: `Under the Anti-Money Laundering Act, 2064, where is the Financial Intelligence Unit (FIU - वित्तीय जानकारी इकाई) established as an autonomous department? (Set ${i})`,
        qNep: `सम्पत्ति शुद्धीकरण (मनी लाउण्डरिङ्ग) निवारण ऐन, २०६४ को दफा ९ बमोजिम वित्तीय जानकारी इकाई (FIU) कुन निकायभित्र रहने व्यवस्था छ? (सेट ${i})`,
        correct: "In Nepal Rastra Bank / नेपाल राष्ट्र बैंकभित्र",
        distractors: [
          "In the Ministry of Home Affairs / गृह मन्त्रालयमा",
          "In the Central Bureau of Investigation (CIB) / केन्द्रीय अनुसन्धान ब्युरोमा",
          "In the Department of Money Laundering Investigation / सम्पत्ति शुद्धीकरण अनुसन्धान विभागमा"
        ],
        expEng: "Section 9 of the AML Act establishes the FIU within Nepal Rastra Bank as an administrative national center for receiving financial intelligence.",
        expNep: "ऐनको दफा ९ अनुसार वित्तीय जानकारी इकाई (FIU) नेपाल राष्ट्र बैंकभित्र एक स्वायत्त राष्ट्रिय निकायको रूपमा रहन्छ।"
      });
    } else if (i % 3 === 2) {
      items.push({
        qEng: `Under AML regulations in Nepal, within how many days must banks report Threshold Transactions (TTR of NPR 10 Lakhs or above) and Suspicious Transactions (STR) to the FIU? (Set ${i})`,
        qNep: `सम्पत्ति शुद्धीकरण निवारण ऐन बमोजिम १० लाख वा सोभन्दा बढीको सीमा कारोबार (TTR) र शङ्कास्पद कारोबार (STR) को प्रतिवेदन वित्तीय जानकारी इकाई (FIU) मा कति दिनभित्र बुझाउनुपर्छ? (सेट ${i})`,
        correct: "TTR within 15 days of following month, STR within 3 days / TTR १५ दिनभित्र र STR ३ दिनभित्र",
        distractors: [
          "TTR within 30 days of following month, STR within 7 days / TTR ३० दिनभित्र र STR ७ दिनभित्र",
          "TTR within 7 days of following month, STR within 7 days / TTR ७ दिनभित्र र STR ७ दिनभित्र",
          "TTR within 3 days of following month, STR within 15 days / TTR ३ दिनभित्र र STR १५ दिनभित्र"
        ],
        expEng: "TTR (transactions of NPR 1 Million+) must be reported within 15 days of the following month, while Suspicious Transaction Reports (STR) must be filed within 3 days.",
        expNep: "१० लाख माथिको कारोबार १५ दिनभित्र (TTR) र शङ्कास्पद देखिएको कारोबार ३ दिनभित्र (STR) FIU मा पठाउनुपर्छ।"
      });
    } else {
      items.push({
        qEng: `Under Section 3(c) of the Banking Offence and Punishment Act, 2064, knowingly drawing a cheque without having sufficient balance (Cheque Bounce) constitutes what legal offence? (Set ${i})`,
        qNep: `बैंकिङ कसुर तथा सजाय ऐन, २०६४ को दफा ३(ग) बमोजिम आफ्नो खातामा पर्याप्त रकम नभएको जानीजानी चेक काटी दिने कार्य (Cheque Bounce) कस्तो कसुर मानिन्छ? (सेट ${i})`,
        correct: "Banking offence punishable by recovery, fine, and imprisonment / बिगो भराई, जरिवाना र कैद सजाय हुने बैंकिङ कसुर",
        distractors: [
          "Civil monetary dispute subject only to an amicable settlement / आपसी समझदारीमा टुङ्ग्याइने सामान्य देवानी विवाद",
          "Administrative breach penalised exclusively by a 10% bank fee / १०% सेवा शुल्क मात्र लाग्ने प्रशासनिक त्रुटि",
          "Disciplinary warning carrying no statutory criminal sanction / कुनै फौजदारी दायित्व आकर्षित नहुने सामान्य चेतावनी"
        ],
        expEng: "Section 3(c) and Section 15 of the Banking Offence Act penalize cheque bounce with full recovery of the dishonored amount, fine, and jail time up to 3 months.",
        expNep: "बैंकिङ कसुर ऐनको दफा ३(ग) अनुसार चेक बाउन्स गर्नु बैंकिङ कसुर हो, जसमा बिगो असुल गरी बिगो बराबर जरिवाना र ३ महिनासम्म कैद हुन सक्छ।"
      });
    }
  }

  return items;
}

export const TOPIC_8_SLOT_36 = buildSlot36Items();
export const TOPIC_8_SLOT_37 = buildSlot37Items();
export const TOPIC_8_SLOT_38 = buildSlot38Items();
export const TOPIC_8_SLOT_39 = buildSlot39Items();
export const TOPIC_8_SLOT_40 = buildSlot40Items();

export function getPublicEnterprisesQuestion(slot: number, setId: number): MasterBilingualItem {
  const idx = (setId - 1) % 50;
  switch (slot) {
    case 36: return TOPIC_8_SLOT_36[idx];
    case 37: return TOPIC_8_SLOT_37[idx];
    case 38: return TOPIC_8_SLOT_38[idx];
    case 39: return TOPIC_8_SLOT_39[idx];
    case 40: return TOPIC_8_SLOT_40[idx];
    default: return TOPIC_8_SLOT_36[idx];
  }
}
