// Editorial room data — full photo lists per room from the CDN.
// Imported by Rooms.vue, Room.vue and Booking.vue.

export interface EditorialRoom {
  id: number;
  slug: string;
  name: string;
  nameTr: string;
  nameEn: string;
  subTr: string;
  subEn: string;
  ledeTr: string;
  ledeEn: string;
  quoteTr: string;
  quoteEn: string;
  capacity: number;
  area: number;
  view: { tr: string; en: string };
  price: { tr: string; en: string };
  photos: string[];
  bath: string[];
  placeholder?: boolean;
}

export const ROOMS_V1: EditorialRoom[] = [
  {
    id: 1,
    slug: 'zeus',
    name: 'Zeus',
    nameTr: 'Zeus',
    nameEn: 'Zeus',
    subTr: 'Tanrıların babası. Avluya bakan oda.',
    subEn: 'Father of the gods. The room facing the courtyard.',
    ledeTr:
      "Doğal taş duvarlar ve ahşap kirişlerin altında, iki kişilik bir yatak; pencereden Bozcaada'nın asma yapraklı sokakları görünür. Sabah, kahvaltı sesi avludan gelir.",
    ledeEn:
      "Beneath natural stone walls and wooden beams, a bed for two; the window opens onto Bozcaada's vine-shaded streets. In the morning, breakfast sounds drift up from the courtyard.",
    quoteTr:
      'Sabahları perdeyi açtığında, taş duvarlardaki gölgeler nasıl yavaşça yer değiştiriyor; ada böyle uyanır.',
    quoteEn:
      'When you draw back the curtain in the morning and watch the shadows on the stone walls slowly shift — this is how the island wakes.',
    capacity: 2,
    area: 24,
    view: { tr: 'Avlu', en: 'Courtyard' },
    price: { tr: '₺ 6.800', en: '₺ 6,800' },
    photos: [
      'oda_1/oda1-1-min.jpg',
      'oda_1/oda1-2-min.jpg',
      'oda_1/oda1-3-min.jpg',
      'oda_1/oda1-4-min.jpg',
      'oda_1/oda1-5-min.jpg',
      'oda_1/oda1-6-min.jpg',
    ],
    bath: ['oda_1/wc-1-min.jpg', 'oda_1/wca-2-min.jpg', 'oda_1/wca-3-min.jpg'],
  },
  {
    id: 2,
    slug: 'hera',
    name: 'Hera',
    nameTr: 'Hera',
    nameEn: 'Hera',
    subTr: 'Sakin ve ışıklı. Çift kişilik dinginlik.',
    subEn: 'Calm and bright. Stillness for two.',
    ledeTr:
      'Hera, sabahın ilk ışığını alan odadır. Açık renkli tekstiller, hafif keten perdeler ve geniş bir yatak. Sade ve net.',
    ledeEn:
      'Hera takes the first light of the morning. Light textiles, sheer linen curtains, a wide bed. Simple and clear.',
    quoteTr:
      'Bazı odalar size dinlenmeyi öğretir. Hera, sessizliğin nasıl bir lüks olduğunu hatırlatır.',
    quoteEn:
      'Some rooms teach you how to rest. Hera reminds you that silence is a kind of luxury.',
    capacity: 2,
    area: 22,
    view: { tr: 'Bahçe', en: 'Garden' },
    price: { tr: '₺ 6.400', en: '₺ 6,400' },
    photos: [
      'oda_2/oda2-1-min.jpg',
      'oda_2/oda2-2-min.jpg',
      'oda_2/oda2-3-min.jpg',
      'oda_2/oda2-4-min.jpg',
      'oda_2/oda2-5-min.jpg',
      'oda_2/oda2-6-min.jpg',
    ],
    bath: ['oda_2/wcb-1-min.jpg', 'oda_2/wcb-2-min.jpg', 'oda_2/wcb-3-min.jpg'],
  },
  {
    id: 3,
    slug: 'tenedos',
    name: 'Tenedos',
    nameTr: 'Tenedos',
    nameEn: 'Tenedos',
    subTr: 'Adanın eski adı. Tarihi izlerin odası.',
    subEn: "The island's old name. The room of historic traces.",
    ledeTr:
      "Bozcaada'nın antik adından adını alan Tenedos, restorasyon sırasında ortaya çıkan orijinal duvar dokusunu açıkta tutar. Geçmişle yeniyi aynı çatı altında dengeler.",
    ledeEn:
      "Named for the island's ancient name, Tenedos keeps the original wall texture exposed from the restoration. It balances the old and the new under the same roof.",
    quoteTr:
      "Eski duvarlara yeni bir hayat sığdırmak — Tenedos'un yaptığı tam olarak bu.",
    quoteEn:
      'To fit a new life into old walls — this is exactly what Tenedos does.',
    capacity: 2,
    area: 26,
    view: { tr: 'Sokak', en: 'Street' },
    price: { tr: '₺ 7.200', en: '₺ 7,200' },
    photos: [
      'oda_3/oda3-1-min.jpg',
      'oda_3/oda3-2-min.jpg',
      'oda_3/oda3-3-min.jpg',
      'oda_3/oda3-4-min.jpg',
      'oda_3/oda3-6-min.jpg',
      'oda_3/oda3-7-min.jpg',
      'oda_3/oda3-8-min.jpg',
      'oda_3/oda3-9-min.jpg',
    ],
    bath: ['oda_3/wcc-1-min.jpg', 'oda_3/wcc-2-min.jpg', 'oda_3/wcc-3-min.jpg'],
  },
  {
    id: 4,
    slug: 'tenes',
    name: 'Tenes',
    nameTr: 'Tenes',
    nameEn: 'Tenes',
    subTr: 'Adalı detaylar, geleneksel mobilya.',
    subEn: 'Island details, traditional furniture.',
    ledeTr:
      "Tenes, evin en geniş odası. Bozcaada'nın yerel marangozluk geleneğini takip eden ahşap işlemeli mobilyalar; sabahın ilk saatlerinde ışıkla dolar.",
    ledeEn:
      "Tenes is the largest room in the house. Wooden furniture following Bozcaada's local craft tradition; it fills with light in the early morning.",
    quoteTr:
      "Eski bir adada yeni bir ev nasıl kurulur? Tenes'te cevap, ölçülü olmaktan geçer.",
    quoteEn:
      'How do you build a new home on an old island? In Tenes, the answer is restraint.',
    capacity: 3,
    area: 32,
    view: { tr: 'Avlu & Sokak', en: 'Courtyard & Street' },
    price: { tr: '₺ 8.400', en: '₺ 8,400' },
    photos: [
      'oda_4/oda4-1-min.jpg',
      'oda_4/oda4-2-min.jpg',
      'oda_4/oda4-3-min.jpg',
      'oda_4/oda4-4-min.jpg',
      'oda_4/oda4-5-min.jpg',
      'oda_4/oda4-6-min.jpg',
      'oda_4/oda4-7-min.jpg',
      'oda_4/oda4-8-min.jpg',
      'oda_4/oda4-9-min.jpg',
      'oda_4/oda4-10-min.jpg',
    ],
    bath: ['oda_4/wcd-1-min.jpg', 'oda_4/wcd-2-min.jpg', 'oda_4/wcd-3-min.jpg'],
  },
  {
    id: 5,
    slug: 'ilyada',
    name: 'İlyada',
    nameTr: 'İlyada',
    nameEn: 'Ilyada',
    subTr: 'Bir destanın adında. Mitolojik katmanlar.',
    subEn: 'Named for an epic. Mythic layers.',
    ledeTr:
      "İlyada, evin en sessiz köşesinde, ada efsanelerine adanmış oda. Küçük bir kütüphane köşesi, derin bir yatak ve kalın taş duvarlar — uzun bir sabah okuması için kurulmuş gibi.",
    ledeEn:
      "İlyada is in the quietest corner of the house, dedicated to island legends. A small reading nook, a deep bed, thick stone walls — as if built for a long morning of reading.",
    quoteTr:
      'Bir kitap okuyarak geçirdiğiniz sabah, bir tatilin tamamından daha uzun hatırlanır.',
    quoteEn:
      'A morning spent reading is remembered longer than a whole holiday.',
    capacity: 2,
    area: 20,
    view: { tr: 'İç bahçe', en: 'Inner garden' },
    price: { tr: '₺ 6.200', en: '₺ 6,200' },
    photos: [
      'oda_4/oda4-5-min.jpg',
      'oda_4/oda4-6-min.jpg',
      'oda_4/oda4-7-min.jpg',
      'oda_4/oda4-8-min.jpg',
      'oda_4/oda4-9-min.jpg',
      'oda_4/oda4-10-min.jpg',
    ],
    bath: ['oda_4/wcd-1-min.jpg', 'oda_4/wcd-2-min.jpg', 'oda_4/wcd-3-min.jpg'],
    placeholder: true,
  },
];

export const findRoom = (idOrSlug: string | number): EditorialRoom | undefined =>
  ROOMS_V1.find((r) => r.id === Number(idOrSlug) || r.slug === String(idOrSlug));
