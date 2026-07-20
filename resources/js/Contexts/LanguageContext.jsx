import React, { createContext, useContext, useState, useEffect } from 'react';

// Rich, complete translations dictionary for EN, DE, and Twi
const translations = {
    en: {
        'nav.home': 'Home',
        'nav.shop': 'Shop',
        'nav.services': 'Services',
        'nav.about': 'About Us',
        'nav.cart': 'Cart',
        'nav.login': 'Sign In',
        'nav.register': 'Sign Up',
        'nav.logout': 'Sign Out',
        'nav.profile': 'My Profile',
        'nav.foods': 'Food & Restaurant',
        
        'hero.cta': 'Shop the Collection',
        'hero.welcome': 'Welcome to Mama Africa',
        'hero.tagline': 'Authentic African & European Styles, Beauty & Premium Care.',
        
        'home.explore': 'Explore Our Offerings',
        'home.explore_sub': 'Discover unique curated beauty, luxury collections and care sessions tailored for you.',
        'home.featured_products': 'Summer & New Arrivals',
        'home.featured_products_sub': 'Fresh designs and authentic care lines directly imported for you.',
        'home.featured_services': 'Premium Care Services',
        'home.featured_services_sub': 'Book customized hair braiding, extensions, and skin treatments.',
        'home.view_details': 'View Collection →',
        'home.no_products': 'No new arrivals featured at the moment.',
        'home.no_services': 'No services currently listed. Check back soon.',
        
        'shop.title': 'Mama Africa Store',
        'shop.subtitle': 'Curated Premium Cosmetics, Fabrics & Traditional Artifacts',
        'shop.filters': 'Filter Products',
        'shop.search_placeholder': 'Search by product name...',
        'shop.all_categories': 'All Categories',
        'shop.min_price': 'Min Price',
        'shop.max_price': 'Max Price',
        'shop.country': 'Origin Country',
        'shop.clear_filters': 'Clear All Filters',
        'shop.no_products': 'No products match your filter criteria.',
        'shop.add_to_cart': 'Add to Cart',
        'shop.whatsapp': 'Message to Buy',
        
        'services.title': 'Professional Beauty & Salon Services',
        'services.subtitle': 'Book high-end African styling, wig styling, braiding, and premium care sessions.',
        'services.book': 'Book Appointment',
        'services.no_services': 'No services matching your selection.',
        
        'about.title': 'Our Story & Heritage',
        'about.subtitle': 'Bridging European styling and authentic African heritage since 2018.',
        'about.mission': 'Our Mission',
        'about.mission_text': 'To deliver high-quality, authentic African cosmetics, fashion, and master-level hair care, making premium traditional beauty accessible in Germany and Ghana.',
        'about.vision': 'Our Vision',
        'about.vision_text': 'To empower local African craftsmen and attendants while bringing luxurious, organic, and modern fashion directly to our global community.',
        
        'cart.title': 'Shopping Basket',
        'cart.empty': 'Your basket is currently empty.',
        'cart.subtotal': 'Subtotal',
        'cart.total': 'Total',
        'cart.checkout': 'Proceed to Checkout',
        'cart.continue': 'Continue Shopping',
        
        'modal.title': 'Complete Booking & Purchase',
        'modal.name': 'Your Name',
        'modal.phone': 'WhatsApp Phone Number',
        'modal.notes': 'Order Notes & Preferences',
        'modal.store': 'Select nearest Store/Location',
        'modal.cta': 'Message to Buy on WhatsApp',
    },
    de: {
        'nav.home': 'Startseite',
        'nav.shop': 'Shop',
        'nav.services': 'Dienstleistungen',
        'nav.about': 'Über uns',
        'nav.cart': 'Warenkorb',
        'nav.login': 'Anmelden',
        'nav.register': 'Registrieren',
        'nav.logout': 'Abmelden',
        'nav.profile': 'Mein Profil',
        'nav.foods': 'Essen & Restaurant',
        
        'hero.cta': 'Kollektion ansehen',
        'hero.welcome': 'Willkommen bei Mama Africa',
        'hero.tagline': 'Authentische afrikanische & europäische Stile, Schönheit & Premiumpflege.',
        
        'home.explore': 'Entdecken Sie unsere Angebote',
        'home.explore_sub': 'Entdecken Sie einzigartige Schönheitsprodukte, Luxuskollektionen und Pflegebehandlungen.',
        'home.featured_products': 'Sommer- & Neuheiten-Kollektion',
        'home.featured_products_sub': 'Frische Designs und authentische Pflegelinien, direkt für Sie importiert.',
        'home.featured_services': 'Premium-Pflegedienste',
        'home.featured_services_sub': 'Buchen Sie individuelles Haarflechten, Extensions und Hautbehandlungen.',
        'home.view_details': 'Kollektion anzeigen →',
        'home.no_products': 'Derzeit sind keine Neuheiten online.',
        'home.no_services': 'Keine Dienstleistungen aufgeführt. Schauen Sie bald wieder vorbei.',
        
        'shop.title': 'Mama Africa Marktplatz',
        'shop.subtitle': 'Ausgewählte Premium-Kosmetik, Stoffe & Traditionelle Handwerkskunst',
        'shop.filters': 'Produkte filtern',
        'shop.search_placeholder': 'Nach Produktnamen suchen...',
        'shop.all_categories': 'Alle Kategorien',
        'shop.min_price': 'Mindestpreis',
        'shop.max_price': 'Höchstpreis',
        'shop.country': 'Herkunftsland',
        'shop.clear_filters': 'Filter zurücksetzen',
        'shop.no_products': 'Keine Produkte entsprechen Ihren Filterkriterien.',
        'shop.add_to_cart': 'In den Warenkorb',
        'shop.whatsapp': 'Auf WhatsApp kaufen',
        
        'services.title': 'Professionelle Schönheits- & Salonbehandlungen',
        'services.subtitle': 'Buchen Sie afrikanisches Styling, Perücken, Flechtfrisuren und Premium-Pflegesitzungen.',
        'services.book': 'Termin buchen',
        'services.no_services': 'Keine Dienstleistungen entsprechen Ihrer Auswahl.',
        
        'about.title': 'Unsere Geschichte & Erbe',
        'about.subtitle': 'Die Verbindung von europäischem Styling und authentischem afrikanischem Erbe seit 2018.',
        'about.mission': 'Unsere Mission',
        'about.mission_text': 'Qualitativ hochwertige, authentische afrikanische Kosmetika, Mode und meisterhafte Haarpflege anzubieten, um traditionelle Schönheit in Deutschland und Ghana zugänglich zu machen.',
        'about.vision': 'Unsere Vision',
        'about.vision_text': 'Lokale afrikanische Handwerker und Mitarbeiter zu fördern und gleichzeitig luxuriöse, biologische und moderne Mode direkt in unsere globale Gemeinschaft zu bringen.',
        
        'cart.title': 'Einkaufskorb',
        'cart.empty': 'Ihr Einkaufskorb ist derzeit leer.',
        'cart.subtotal': 'Zwischensumme',
        'cart.total': 'Gesamtsumme',
        'cart.checkout': 'Zur Kasse gehen',
        'cart.continue': 'Weiter einkaufen',
        
        'modal.title': 'Buchung & Kauf abschließen',
        'modal.name': 'Ihr Name',
        'modal.phone': 'WhatsApp Telefonnummer',
        'modal.notes': 'Bestellnotizen & Wünsche',
        'modal.store': 'Wählen Sie die nächstgelegene Filiale',
        'modal.cta': 'Auf WhatsApp kaufen',
    },
    tw: {
        'nav.home': 'Fie',
        'nav.shop': 'Tɔ Nneɛma',
        'nav.services': 'Dwumadi',
        'nav.about': 'Yɛn Ho Asɛm',
        'nav.cart': 'Kɛntɛn',
        'nav.login': 'Kɔ Mu',
        'nav.register': 'Twerɛ Wo Din',
        'nav.logout': 'Firi Mu',
        'nav.profile': 'M\'ahyɛaseɛ',
        'nav.foods': 'Aduane',
        
        'hero.cta': 'Tɔ Seesei',
        'hero.welcome': 'Akwaaba kɔ Mama Africa',
        'hero.tagline': 'Abibirem ne Amannɔne amammerɛ afɛfɛdeɛ ne anim paapaaeɛ.',
        
        'home.explore': 'Hwehwɛ Yɛn Nneɛma Mu',
        'home.explore_sub': 'Hunu ahoɔfɛ nneɛma soronko, ahodeɛ afɛfɛ ne ahoɔfɛ dwumadi a yɛahyɛ da ayɛ ama wo.',
        'home.featured_products': 'Ɔpɛ & Nneɛma Foforɔ',
        'home.featured_products_sub': 'Ntadeɛ pa ne aduane pa afɛfɛdeɛ a yɛde fi amannɔne ba pɛɛ ama wo.',
        'home.featured_services': 'Ahoɔfɛ Som Pa',
        'home.featured_services_sub': 'Gye bere ma nwene mpɛsɛpɛsɛ, wig nyɛeɛ ne honam ahoɔfɛ edwuma.',
        'home.view_details': 'Hwɛ Ne Nyinaa →',
        'home.no_products': 'Nneɛma foforɔ biara nni hɔ seesei.',
        'home.no_services': 'Ahoɔfɛ dwumadi biara nni hɔ seesei. Bɛhwɛ bio nnansa yi.',
        
        'shop.title': 'Mama Africa Dwaso',
        'shop.subtitle': 'Ahoɔfɛ Nku, Ntama Pa ne Amanmerɛ Nneɛma fɛfɛɛfɛ',
        'shop.filters': 'Yi Nneɛma',
        'shop.search_placeholder': 'Hwehwɛ nea wopɛ din mu...',
        'shop.all_categories': 'Nkyekyɛmu Nyinaa',
        'shop.min_price': 'Boɔ Ketewa',
        'shop.max_price': 'Boɔ Kɛseɛ',
        'shop.country': 'Ɔman A Ɛfiri',
        'shop.clear_filters': 'Popo Ne Nyinaa Fi Mu',
        'shop.no_products': 'Yɛannya biribiara a ɛne wo hwehwɛdeɛ hyia.',
        'shop.add_to_cart': 'Fa To Kɛntɛn Mu',
        'shop.whatsapp': 'Fa WhatsApp So Tɔ',
        
        'services.title': 'Amanmerɛ Mpesempese Dwumadi Pa',
        'services.subtitle': 'Gye bere nwene ti, fa wig foforɔ ne ahoɔfɛ nku to wo honam mu.',
        'services.book': 'Gye Bere Seesei',
        'services.no_services': 'Dwumadi biara nni hɔ ma saa nkyekyɛmu yi.',
        
        'about.title': 'Yɛn Ahyɛaseɛ ne Amanmerɛ',
        'about.subtitle': 'Yɛka Abibirem ahoɔfɛ ne Amannɔne amammerɛ bɔ mu fi afe 2018.',
        'about.mission': 'Yɛn Botaeɛ',
        'about.mission_text': 'Yɛpɛ sɛ yɛde ahoɔfɛ aduro pa, ntadeɛ fɛfɛ ne atinim nwene pa ma Abibifoɔ ne Amannɔnefoɔ nyinaa wɔ Germany ne Ghana.',
        'about.vision': 'Yɛn Asoaeɛ',
        'about.vision_text': 'Yɛpɛ sɛ yɛhyɛ adwumayɛfoɔ nkuran na yɛde ntadeɛ soronko ne nku pa bɛto yɛn manfoɔ anim daa.',
        
        'cart.title': 'Basket A Ɛwɔ Mu',
        'cart.empty': 'Wo kɛntɛn no da mpan seesei.',
        'cart.subtotal': 'Ne Nyinaa Nketewa',
        'cart.total': 'Ne Nyinaa',
        'cart.checkout': 'Tua Ka Seesei',
        'cart.continue': 'Tɔ Nneɛma Bio',
        
        'modal.title': 'Wie Wo Dwumadi Pa Yɛ',
        'modal.name': 'Wo Din',
        'modal.phone': 'WhatsApp Nɔma',
        'modal.notes': 'Dwumadi Ho Asɛm Foforɔ',
        'modal.store': 'Yi Kɔbere A Ɛbɛn Wo',
        'modal.cta': 'Fa WhatsApp So Tɔ Seesei',
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(
        localStorage.getItem('mama_language') || 'en'
    );

    useEffect(() => {
        localStorage.setItem('mama_language', language);
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
