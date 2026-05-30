export interface Tour {
  id: string;
  name: string;
  slug: string;
  duration: string;
  durationMinutes: number;
  schedule: string;
  days: string;
  destination: string;
  description: string;
  itinerary: string[];
  highlights: string[];
  included: string[];
  price2Seater: number;
  price4Seater: number;
  image: string;
  icon: string;
}

export const tours: Tour[] = [
  {
    id: 'monte-cresto',
    name: 'Monte do Cresto',
    slug: 'monte-do-cresto',
    duration: '75 min',
    durationMinutes: 75,
    schedule: '14h00 → 15h15',
    days: 'Sábado e Domingo',
    destination: 'Monte do Cresto, Aldreu',
    description: 'Uma aventura off-road inesquecível pelas paisagens selvagens do Minho. Parte das nossas instalações em Neiva, atravessa Barreiras (Alvarães), cruza o Rio Neiva por uma ponte de pedra histórica e sobe até ao Monte do Cresto em Aldreu, onde terás uma vista panorâmica deslumbrante sobre Braga, Viana do Castelo, Póvoa de Varzim e Porto.',
    itinerary: [
      'Partida das instalações Viana Buggy em Neiva',
      'Travessia por Barreiras (Alvarães)',
      'Cruzamento do Rio Neiva por ponte de pedra',
      'Travessia de ribeiro (momento de adrenalina!)',
      'Subida ao Monte do Cresto (Aldreu)',
      'Paragem para fotos com vista panorâmica',
      'Regresso pelo mesmo percurso'
    ],
    highlights: [
      'Vista panorâmica para 4 cidades',
      'Travessia de ribeiro',
      'Ponte de pedra histórica sobre o Rio Neiva',
      'Trilhos de terra batida autênticos'
    ],
    included: [
      'Buggy Can-Am com seguro incluído',
      'Guia/instrutor experiente',
      'Óculos de proteção',
      'Briefing de segurança',
      'Paragem para fotos'
    ],
    price2Seater: 75,
    price4Seater: 100,
    image: '/images/tour-monte-cresto.png',
    icon: 'Mountain'
  },
  {
    id: 'monte-sgoncalo',
    name: 'Monte S. Gonçalo',
    slug: 'monte-s-goncalo',
    duration: '135 min',
    durationMinutes: 135,
    schedule: '15h30 → 17h45',
    days: 'Sábado e Domingo',
    destination: 'Monte de S. Gonçalo',
    description: 'O nosso tour mais completo. Uma expedição de 2h15 que te leva ao ponto mais alto do concelho de Barcelos — o Monte de S. Gonçalo. Prepara-te para trilhos desafiantes, uma travessia de ribeiro que vai fazer o teu coração acelerar, e vistas que se estendem desde Braga até ao Porto.',
    itinerary: [
      'Partida das instalações Viana Buggy em Neiva',
      'Travessia por Barreiras (Alvarães)',
      'Cruzamento do Rio Neiva',
      'Passagem por Fragoso',
      'Travessia de ribeiro (máxima adrenalina!)',
      'Subida ao Monte de S. Gonçalo (ponto mais alto de Barcelos)',
      'Vista panorâmica sobre Braga, Viana, Póvoa e Porto',
      'Descida por trilhos alternativos',
      'Regresso a Neiva'
    ],
    highlights: [
      'Ponto mais alto do concelho de Barcelos',
      'Travessia de ribeiro — momento de adrenalina',
      'Vistas para 4 cidades',
      'Trilhos variados e desafiantes',
      '2h15 de pura aventura'
    ],
    included: [
      'Buggy Can-Am com seguro incluído',
      'Guia/instrutor experiente',
      'Óculos de proteção',
      'Briefing de segurança',
      'Múltiplas paragens para fotos',
      'Água'
    ],
    price2Seater: 125,
    price4Seater: 170,
    image: '/images/tour-monte-sgoncalo.png',
    icon: 'Compass'
  },
  {
    id: 'sunset-night',
    name: 'Sunset & Night Tour',
    slug: 'sunset-night-tour',
    duration: '150 min',
    durationMinutes: 150,
    schedule: 'Pôr do sol + noite',
    days: 'Horário variável',
    destination: 'Monte do Cresto',
    description: 'A experiência mais exclusiva da Viana Buggy. Um tour noturno que combina a magia do pôr do sol sobre o Atlântico com a emoção de conduzir de noite pelos trilhos do Minho. Sobe ao Monte do Cresto para assistires ao pôr do sol mais bonito do Norte de Portugal, e depois desce na escuridão com os faróis a iluminar o caminho.',
    itinerary: [
      'Partida das instalações ao fim da tarde',
      'Percurso por Barreiras (Alvarães)',
      'Cruzamento do Rio Neiva',
      'Subida ao Monte do Cresto',
      'Paragem para assistir ao pôr do sol',
      'Sessão fotográfica com luz dourada',
      'Descida noturna com faróis',
      'Regresso a Neiva sob as estrelas'
    ],
    highlights: [
      'Pôr do sol espetacular sobre o Atlântico',
      'Condução noturna com faróis',
      'Experiência única e exclusiva',
      'Cenário fotográfico incrível',
      '2h30 de aventura'
    ],
    included: [
      'Buggy Can-Am com seguro incluído',
      'Guia/instrutor experiente',
      'Óculos de proteção',
      'Briefing de segurança',
      'Paragens para fotos do pôr do sol',
      'Iluminação noturna completa',
      'Água e snack'
    ],
    price2Seater: 150,
    price4Seater: 200,
    image: '/images/tour-sunset.png',
    icon: 'Sunset'
  }
];

export function getTourById(id: string): Tour | undefined {
  return tours.find(t => t.id === id);
}

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find(t => t.slug === slug);
}
