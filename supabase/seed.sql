-- ==============================================================================
-- BUGGYFLOW - SUPABASE DATABASE SCHEMA & SEED
-- Execute this script in the Supabase SQL Editor
-- ==============================================================================

-- 1. Create Tables

CREATE TABLE IF NOT EXISTS public.tours_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    duration TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    schedule TEXT NOT NULL,
    days TEXT NOT NULL,
    destination TEXT NOT NULL,
    description TEXT NOT NULL,
    itinerary TEXT[] NOT NULL DEFAULT '{}',
    highlights TEXT[] NOT NULL DEFAULT '{}',
    included TEXT[] NOT NULL DEFAULT '{}',
    price_2seater INTEGER NOT NULL,
    price_4seater INTEGER NOT NULL,
    max_buggies_per_slot INTEGER NOT NULL DEFAULT 6,
    available_days TEXT[] NOT NULL DEFAULT '{Saturday,Sunday}',
    time_slots TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_code TEXT UNIQUE NOT NULL,
    tour_id UUID REFERENCES public.tours_config(id) ON DELETE CASCADE,
    slot_date TEXT NOT NULL,
    slot_time TEXT NOT NULL,
    creator_reservation_id UUID, -- Will be set after reservation is created
    name TEXT,
    max_buggies INTEGER DEFAULT 6,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_ref TEXT UNIQUE NOT NULL,
    tour_id UUID REFERENCES public.tours_config(id),
    group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
    slot_date TEXT NOT NULL,
    slot_time TEXT NOT NULL,
    buggy_type TEXT NOT NULL,
    buggy_quantity INTEGER NOT NULL,
    people_count INTEGER NOT NULL DEFAULT 0,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pendente', -- pendente, pendente_mbway, confirmado, cancelado
    payment_method TEXT NOT NULL,
    stripe_session_id TEXT,
    total_price INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add Foreign Key to groups (creator_reservation_id) now that reservations table exists
ALTER TABLE public.groups 
    ADD CONSTRAINT fk_creator_reservation 
    FOREIGN KEY (creator_reservation_id) 
    REFERENCES public.reservations(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'staff')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 2. Row Level Security (RLS)
-- ==============================================================================

ALTER TABLE public.tours_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Tours: Everyone can read active tours. Admin can do everything.
CREATE POLICY "Public can read active tours" ON public.tours_config FOR SELECT USING (is_active = true);
CREATE POLICY "Admin can manage tours" ON public.tours_config TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- Groups: Public can read groups (to join them). Insert/Update via Service Role.
CREATE POLICY "Public can read groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Admin/Staff can manage groups" ON public.groups TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND is_active = true)
);

-- Reservations: Public cannot read (Service Role only). Admin/Staff can manage.
CREATE POLICY "Admin/Staff can manage reservations" ON public.reservations TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND is_active = true)
);

-- Admin Users: Only Admin can manage. Users can read themselves.
CREATE POLICY "Users can read own profile" ON public.admin_users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Admin can manage admin_users" ON public.admin_users TO authenticated USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- ==============================================================================
-- 3. Initial Seed Data (Tours)
-- ==============================================================================

INSERT INTO public.tours_config (
    id, name, slug, duration, duration_minutes, schedule, days, destination, 
    description, itinerary, highlights, included, price_2seater, price_4seater, 
    time_slots, image_url, icon, display_order
) VALUES
(
    '00000000-0000-0000-0000-000000000001',
    'Monte do Cresto',
    'monte-do-cresto',
    '75 min',
    75,
    '14h00 → 15h15',
    'Sábado e Domingo',
    'Monte do Cresto, Aldreu',
    'Uma aventura off-road inesquecível pelas paisagens selvagens do Minho. Parte das nossas instalações em Neiva, atravessa Barreiras (Alvarães), cruza o Rio Neiva por uma ponte de pedra histórica e sobe até ao Monte do Cresto em Aldreu, onde terás uma vista panorâmica deslumbrante sobre Braga, Viana do Castelo, Póvoa de Varzim e Porto.',
    ARRAY['Partida das instalações Viana Buggy em Neiva', 'Travessia por Barreiras (Alvarães)', 'Cruzamento do Rio Neiva por ponte de pedra', 'Travessia de ribeiro (momento de adrenalina!)', 'Subida ao Monte do Cresto (Aldreu)', 'Paragem para fotos com vista panorâmica', 'Regresso pelo mesmo percurso'],
    ARRAY['Vista panorâmica para 4 cidades', 'Travessia de ribeiro', 'Ponte de pedra histórica sobre o Rio Neiva', 'Trilhos de terra batida autênticos'],
    ARRAY['Buggy Can-Am com seguro incluído', 'Guia/instrutor experiente', 'Óculos de proteção', 'Briefing de segurança', 'Paragem para fotos'],
    75,
    100,
    ARRAY['09:00', '10:30', '14:00', '16:00'],
    '/images/tour-monte-cresto.png',
    'Mountain',
    1
),
(
    '00000000-0000-0000-0000-000000000002',
    'Monte S. Gonçalo',
    'monte-s-goncalo',
    '135 min',
    135,
    '15h30 → 17h45',
    'Sábado e Domingo',
    'Monte de S. Gonçalo',
    'O nosso tour mais completo. Uma expedição de 2h15 que te leva ao ponto mais alto do concelho de Barcelos — o Monte de S. Gonçalo. Prepara-te para trilhos desafiantes, uma travessia de ribeiro que vai fazer o teu coração acelerar, e vistas que se estendem desde Braga até ao Porto.',
    ARRAY['Partida das instalações Viana Buggy em Neiva', 'Travessia por Barreiras (Alvarães)', 'Cruzamento do Rio Neiva', 'Passagem por Fragoso', 'Travessia de ribeiro (máxima adrenalina!)', 'Subida ao Monte de S. Gonçalo (ponto mais alto de Barcelos)', 'Vista panorâmica sobre Braga, Viana, Póvoa e Porto', 'Descida por trilhos alternativos', 'Regresso a Neiva'],
    ARRAY['Ponto mais alto do concelho de Barcelos', 'Travessia de ribeiro — momento de adrenalina', 'Vistas para 4 cidades', 'Trilhos variados e desafiantes', '2h15 de pura aventura'],
    ARRAY['Buggy Can-Am com seguro incluído', 'Guia/instrutor experiente', 'Óculos de proteção', 'Briefing de segurança', 'Múltiplas paragens para fotos', 'Água'],
    125,
    170,
    ARRAY['09:00', '15:30'],
    '/images/tour-monte-sgoncalo.png',
    'Compass',
    2
),
(
    '00000000-0000-0000-0000-000000000003',
    'Sunset & Night Tour',
    'sunset-night-tour',
    '150 min',
    150,
    'Pôr do sol + noite',
    'Horário variável',
    'Monte do Cresto',
    'A experiência mais exclusiva da Viana Buggy. Um tour noturno que combina a magia do pôr do sol sobre o Atlântico com a emoção de conduzir de noite pelos trilhos do Minho. Sobe ao Monte do Cresto para assistires ao pôr do sol mais bonito do Norte de Portugal, e depois desce na escuridão com os faróis a iluminar o caminho.',
    ARRAY['Partida das instalações ao fim da tarde', 'Percurso por Barreiras (Alvarães)', 'Cruzamento do Rio Neiva', 'Subida ao Monte do Cresto', 'Paragem para assistir ao pôr do sol', 'Sessão fotográfica com luz dourada', 'Descida noturna com faróis', 'Regresso a Neiva sob as estrelas'],
    ARRAY['Pôr do sol espetacular sobre o Atlântico', 'Condução noturna com faróis', 'Experiência única e exclusiva', 'Cenário fotográfico incrível', '2h30 de aventura'],
    ARRAY['Buggy Can-Am com seguro incluído', 'Guia/instrutor experiente', 'Óculos de proteção', 'Briefing de segurança', 'Paragens para fotos do pôr do sol', 'Iluminação noturna completa', 'Água e snack'],
    150,
    200,
    ARRAY['18:30'],
    '/images/tour-sunset.png',
    'Sunset',
    3
)
ON CONFLICT (id) DO NOTHING;
