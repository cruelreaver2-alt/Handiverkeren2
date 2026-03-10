import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { Header } from "../components/Header";
import {
  Search,
  Plus,
  Trash2,
  Calculator,
  FileText,
  Brain,
  Sparkles,
  Package,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Material database (simplified - in real app, fetch from backend)
const MATERIAL_DATABASE = {
  tak: [
    // Takstein
    { id: "tak-1", name: "Takstein Monier Novo", category: "Takstein", unit: "stk", pricePerUnit: 45, coverage: 0.33 },
    { id: "tak-2", name: "Takstein Optimal Protector", category: "Takstein", unit: "stk", pricePerUnit: 52, coverage: 0.33 },
    { id: "tak-3", name: "Takstein Braas Turmalin", category: "Takstein", unit: "stk", pricePerUnit: 58, coverage: 0.33 },
    { id: "tak-4", name: "Takstein Monier Classic", category: "Takstein", unit: "stk", pricePerUnit: 48, coverage: 0.33 },
    { id: "tak-5", name: "Mønestein Monier", category: "Takstein", unit: "stk", pricePerUnit: 85, coverage: 0 },
    { id: "tak-6", name: "Gesims Monier", category: "Takstein", unit: "stk", pricePerUnit: 95, coverage: 0 },
    // Undertak og membran
    { id: "tak-7", name: "Undertak Tyvek", category: "Undertak", unit: "m²", pricePerUnit: 35, coverage: 1 },
    { id: "tak-8", name: "Undertak Isola Flexidry", category: "Undertak", unit: "m²", pricePerUnit: 42, coverage: 1 },
    { id: "tak-9", name: "Takpapp S4500", category: "Papp", unit: "m²", pricePerUnit: 28, coverage: 1 },
    { id: "tak-10", name: "Takpapp Plastbit P-FB 5000", category: "Papp", unit: "m²", pricePerUnit: 65, coverage: 1 },
    { id: "tak-11", name: "Taktekking Icopal", category: "Papp", unit: "m²", pricePerUnit: 78, coverage: 1 },
    // Takrenner og nedløp
    { id: "tak-12", name: "Takrenne aluminium 150mm", category: "Takrenner", unit: "m", pricePerUnit: 180, coverage: 1 },
    { id: "tak-13", name: "Takrenne plast 125mm", category: "Takrenner", unit: "m", pricePerUnit: 95, coverage: 1 },
    { id: "tak-14", name: "Nedløpsrør aluminium 100mm", category: "Nedløp", unit: "m", pricePerUnit: 145, coverage: 1 },
    { id: "tak-15", name: "Nedløpsrør plast 75mm", category: "Nedløp", unit: "m", pricePerUnit: 75, coverage: 1 },
    { id: "tak-16", name: "Takrennehjørne", category: "Takrenner", unit: "stk", pricePerUnit: 125, coverage: 0 },
    { id: "tak-17", name: "Løvhinder for takrenne", category: "Tilbehør", unit: "m", pricePerUnit: 85, coverage: 1 },
    // Festematerialer
    { id: "tak-18", name: "Stormklips rustfri", category: "Stormklips", unit: "stk", pricePerUnit: 12, coverage: 0.33 },
    { id: "tak-19", name: "Takspiker galvanisert", category: "Festemateriell", unit: "kg", pricePerUnit: 145, coverage: 0 },
    { id: "tak-20", name: "Takstoler 48x148mm", category: "Bæring", unit: "m", pricePerUnit: 95, coverage: 0 },
    { id: "tak-21", name: "Lekter 36x48mm", category: "Bæring", unit: "m", pricePerUnit: 28, coverage: 0 },
    // Tilbehør
    { id: "tak-22", name: "Vindskier Monier", category: "Tilbehør", unit: "m", pricePerUnit: 95, coverage: 1 },
    { id: "tak-23", name: "Takstiger aluminium", category: "Tilbehør", unit: "stk", pricePerUnit: 1250, coverage: 0 },
    { id: "tak-24", name: "Snøfangere stål", category: "Tilbehør", unit: "stk", pricePerUnit: 285, coverage: 0 },
    { id: "tak-25", name: "Takluker Velux 78x98cm", category: "Tilbehør", unit: "stk", pricePerUnit: 4850, coverage: 0 },
    { id: "tak-26", name: "Takventilator", category: "Tilbehør", unit: "stk", pricePerUnit: 1650, coverage: 0 },
    { id: "tak-27", name: "Isbryter til takrenne", category: "Tilbehør", unit: "stk", pricePerUnit: 195, coverage: 0 },
  ],
  maling: [
    // Innendørs maling
    { id: "mal-1", name: "Jotun Lady Supreme Hvit", category: "Innendørs", unit: "liter", pricePerUnit: 195, coverage: 10 },
    { id: "mal-2", name: "Jotun Lady Pure Color", category: "Innendørs", unit: "liter", pricePerUnit: 215, coverage: 10 },
    { id: "mal-3", name: "Beckers Maling Hvit", category: "Innendørs", unit: "liter", pricePerUnit: 165, coverage: 10 },
    { id: "mal-4", name: "Flügger Flutex 7", category: "Innendørs", unit: "liter", pricePerUnit: 185, coverage: 10 },
    { id: "mal-5", name: "Jotun Sens Hypoallergen", category: "Innendørs", unit: "liter", pricePerUnit: 225, coverage: 9 },
    { id: "mal-6", name: "Beckers Elegant Matt", category: "Innendørs", unit: "liter", pricePerUnit: 175, coverage: 10 },
    // Utendørs maling
    { id: "mal-7", name: "Jotun Trebitt Hvit", category: "Utendørs", unit: "liter", pricePerUnit: 285, coverage: 8 },
    { id: "mal-8", name: "Jotun Demidekk Hvit", category: "Utendørs", unit: "liter", pricePerUnit: 315, coverage: 8 },
    { id: "mal-9", name: "Jotun Demidekk Farge", category: "Utendørs", unit: "liter", pricePerUnit: 335, coverage: 8 },
    { id: "mal-10", name: "Beckers Professional Utomhus", category: "Utendørs", unit: "liter", pricePerUnit: 295, coverage: 8 },
    { id: "mal-11", name: "Jotun Visir Oljemaling", category: "Utendørs", unit: "liter", pricePerUnit: 265, coverage: 10 },
    // Grunning
    { id: "mal-12", name: "Grunning innendørs", category: "Grunning", unit: "liter", pricePerUnit: 185, coverage: 10 },
    { id: "mal-13", name: "Grunning utendørs", category: "Grunning", unit: "liter", pricePerUnit: 225, coverage: 8 },
    { id: "mal-14", name: "Grunning metall rustbeskyttende", category: "Grunning", unit: "liter", pricePerUnit: 245, coverage: 8 },
    { id: "mal-15", name: "Isoleringsgrunn", category: "Grunning", unit: "liter", pricePerUnit: 295, coverage: 7 },
    // Spackelmasse og fyllstoffer
    { id: "mal-16", name: "Spackelmasse Gyproc Fugemasse", category: "Sparkel", unit: "kg", pricePerUnit: 45, coverage: 0 },
    { id: "mal-17", name: "Finspackel Gyproc Finish", category: "Sparkel", unit: "kg", pricePerUnit: 55, coverage: 0 },
    { id: "mal-18", name: "Trefyllstoff", category: "Fyllstoff", unit: "kg", pricePerUnit: 125, coverage: 0 },
    { id: "mal-19", name: "Akryl fugemasse", category: "Fyllstoff", unit: "stk", pricePerUnit: 65, coverage: 0 },
    // Verktøy og tilbehør
    { id: "mal-20", name: "Malerruller Anza 25cm", category: "Verktøy", unit: "stk", pricePerUnit: 65, coverage: 0 },
    { id: "mal-21", name: "Malerruller XL 40cm", category: "Verktøy", unit: "stk", pricePerUnit: 95, coverage: 0 },
    { id: "mal-22", name: "Penselsett 5 deler", category: "Verktøy", unit: "sett", pricePerUnit: 285, coverage: 0 },
    { id: "mal-23", name: "Malerpensler Anza Elite 50mm", category: "Verktøy", unit: "stk", pricePerUnit: 145, coverage: 0 },
    { id: "mal-24", name: "Avdekningsplast 4x5m", category: "Verktøy", unit: "stk", pricePerUnit: 85, coverage: 0 },
    { id: "mal-25", name: "Malertape 50mm", category: "Verktøy", unit: "rull", pricePerUnit: 45, coverage: 0 },
    { id: "mal-26", name: "Malebøtte 15L", category: "Verktøy", unit: "stk", pricePerUnit: 125, coverage: 0 },
    { id: "mal-27", name: "Sprutpistol elektrisk", category: "Verktøy", unit: "stk", pricePerUnit: 1850, coverage: 0 },
  ],
  trevare: [
    // Panel
    { id: "tom-1", name: "Panel 15x120mm furu", category: "Panel", unit: "m", pricePerUnit: 45, coverage: 0.12 },
    { id: "tom-2", name: "Panel 18x145mm furu", category: "Panel", unit: "m", pricePerUnit: 58, coverage: 0.145 },
    { id: "tom-3", name: "Kledning 21x148mm", category: "Panel", unit: "m", pricePerUnit: 68, coverage: 0.148 },
    { id: "tom-4", name: "Profilpanel 14x146mm gran", category: "Panel", unit: "m", pricePerUnit: 52, coverage: 0.146 },
    // Trelast
    { id: "tom-5", name: "Stenderverk 48x98mm", category: "Trelast", unit: "m", pricePerUnit: 35, coverage: 0 },
    { id: "tom-6", name: "Bjelke 48x148mm", category: "Trelast", unit: "m", pricePerUnit: 58, coverage: 0 },
    { id: "tom-7", name: "Bjelke 48x198mm", category: "Trelast", unit: "m", pricePerUnit: 78, coverage: 0 },
    { id: "tom-8", name: "Plank 23x148mm", category: "Trelast", unit: "m", pricePerUnit: 48, coverage: 0 },
    { id: "tom-9", name: "Reglar 36x48mm", category: "Trelast", unit: "m", pricePerUnit: 22, coverage: 0 },
    // Plater
    { id: "tom-10", name: "Kryssfiner 12mm", category: "Plater", unit: "m²", pricePerUnit: 195, coverage: 1 },
    { id: "tom-11", name: "Kryssfiner 15mm", category: "Plater", unit: "m²", pricePerUnit: 235, coverage: 1 },
    { id: "tom-12", name: "Gipsplater 13mm", category: "Plater", unit: "m²", pricePerUnit: 125, coverage: 1 },
    { id: "tom-13", name: "Gipsplater fuktsikker 13mm", category: "Plater", unit: "m²", pricePerUnit: 165, coverage: 1 },
    { id: "tom-14", name: "Sponplate 22mm", category: "Plater", unit: "m²", pricePerUnit: 285, coverage: 1 },
    { id: "tom-15", name: "OSB plate 12mm", category: "Plater", unit: "m²", pricePerUnit: 145, coverage: 1 },
    // Parkett og gulv
    { id: "tom-16", name: "Parkett eik 3-stav", category: "Gulv", unit: "m²", pricePerUnit: 385, coverage: 1 },
    { id: "tom-17", name: "Parkett ask 2-stav", category: "Gulv", unit: "m²", pricePerUnit: 425, coverage: 1 },
    { id: "tom-18", name: "Laminat 8mm eik", category: "Gulv", unit: "m²", pricePerUnit: 185, coverage: 1 },
    { id: "tom-19", name: "Vinylgulv 4mm", category: "Gulv", unit: "m²", pricePerUnit: 245, coverage: 1 },
    { id: "tom-20", name: "Underlayer 3mm", category: "Gulv", unit: "m²", pricePerUnit: 35, coverage: 1 },
    { id: "tom-21", name: "Dampsperre PE-folie", category: "Gulv", unit: "m²", pricePerUnit: 18, coverage: 1 },
    // Terrasse
    { id: "tom-22", name: "Terrassebord impregnert 28x120mm", category: "Terrasse", unit: "m", pricePerUnit: 58, coverage: 0.12 },
    { id: "tom-23", name: "Terrassebord kompositt 25x145mm", category: "Terrasse", unit: "m", pricePerUnit: 145, coverage: 0.145 },
    { id: "tom-24", name: "Terrassebord sibirsk lerk 27x120mm", category: "Terrasse", unit: "m", pricePerUnit: 95, coverage: 0.12 },
    { id: "tom-25", name: "Terrasseskruer rustfri", category: "Terrasse", unit: "pk (200 stk)", pricePerUnit: 185, coverage: 0 },
    { id: "tom-26", name: "Terrassefeste justerbart", category: "Terrasse", unit: "stk", pricePerUnit: 45, coverage: 0 },
    // Rekkverk og gelender
    { id: "tom-27", name: "Rekkverksstolpe 70x70mm", category: "Rekkverk", unit: "stk", pricePerUnit: 285, coverage: 0 },
    { id: "tom-28", name: "Håndlist 42x67mm", category: "Rekkverk", unit: "m", pricePerUnit: 95, coverage: 1 },
    { id: "tom-29", name: "Spiler for rekkverk", category: "Rekkverk", unit: "stk", pricePerUnit: 45, coverage: 0 },
    { id: "tom-30", name: "Glassrekkverk komplett", category: "Rekkverk", unit: "m", pricePerUnit: 2850, coverage: 1 },
    // Dører og vinduer
    { id: "tom-31", name: "Innerdør glatt 81x201cm", category: "Dører", unit: "stk", pricePerUnit: 1850, coverage: 0 },
    { id: "tom-32", name: "Ytterdør 98x208cm", category: "Dører", unit: "stk", pricePerUnit: 8500, coverage: 0 },
    { id: "tom-33", name: "Vindu 3-lags 120x120cm", category: "Vinduer", unit: "stk", pricePerUnit: 4850, coverage: 0 },
    { id: "tom-34", name: "Dørkarm 98cm", category: "Dører", unit: "stk", pricePerUnit: 585, coverage: 0 },
    { id: "tom-35", name: "Dørbeslag komplett", category: "Dører", unit: "sett", pricePerUnit: 385, coverage: 0 },
    // Isolasjon
    { id: "tom-36", name: "Isolasjon Glava 100mm", category: "Isolasjon", unit: "m²", pricePerUnit: 65, coverage: 1 },
    { id: "tom-37", name: "Isolasjon Glava 150mm", category: "Isolasjon", unit: "m²", pricePerUnit: 85, coverage: 1 },
    { id: "tom-38", name: "Isolasjon Glava 200mm", category: "Isolasjon", unit: "m²", pricePerUnit: 115, coverage: 1 },
    { id: "tom-39", name: "Rockwool steinull 100mm", category: "Isolasjon", unit: "m²", pricePerUnit: 75, coverage: 1 },
    // Festemateriell
    { id: "tom-40", name: "Skruer 4x50mm (500 stk)", category: "Festemateriell", unit: "pk", pricePerUnit: 125, coverage: 0 },
    { id: "tom-41", name: "Spiker 3x75mm (2 kg)", category: "Festemateriell", unit: "pk", pricePerUnit: 95, coverage: 0 },
    { id: "tom-42", name: "Vinkeljern 90x90mm", category: "Festemateriell", unit: "stk", pricePerUnit: 35, coverage: 0 },
    { id: "tom-43", name: "Bærebjelkefeste", category: "Festemateriell", unit: "stk", pricePerUnit: 65, coverage: 0 },
  ],
  elektrisk: [
    // Kabler
    { id: "elk-1", name: "Kabel 1.5mm² YMM (100m)", category: "Kabler", unit: "m", pricePerUnit: 12, coverage: 1 },
    { id: "elk-2", name: "Kabel 2.5mm² YMM (100m)", category: "Kabler", unit: "m", pricePerUnit: 18, coverage: 1 },
    { id: "elk-3", name: "Kabel 4mm² YMM (100m)", category: "Kabler", unit: "m", pricePerUnit: 28, coverage: 1 },
    { id: "elk-4", name: "Kabel 6mm² YMM (100m)", category: "Kabler", unit: "m", pricePerUnit: 42, coverage: 1 },
    { id: "elk-5", name: "Kabel 10mm² YMM (100m)", category: "Kabler", unit: "m", pricePerUnit: 68, coverage: 1 },
    { id: "elk-6", name: "Jordkabel 16mm² grønn/gul", category: "Kabler", unit: "m", pricePerUnit: 35, coverage: 1 },
    // Stikkontakter og brytere
    { id: "elk-7", name: "Stikkontakt Elko Plus hvit", category: "Uttak", unit: "stk", pricePerUnit: 45, coverage: 0 },
    { id: "elk-8", name: "Stikkontakt Elko Plus matt hvit", category: "Uttak", unit: "stk", pricePerUnit: 52, coverage: 0 },
    { id: "elk-9", name: "USB-stikkontakt dobbel", category: "Uttak", unit: "stk", pricePerUnit: 285, coverage: 0 },
    { id: "elk-10", name: "Bryter enkelt Elko Plus", category: "Brytere", unit: "stk", pricePerUnit: 55, coverage: 0 },
    { id: "elk-11", name: "Bryter dobbel Elko Plus", category: "Brytere", unit: "stk", pricePerUnit: 75, coverage: 0 },
    { id: "elk-12", name: "Bryter trippel Elko Plus", category: "Brytere", unit: "stk", pricePerUnit: 95, coverage: 0 },
    { id: "elk-13", name: "Dimmer LED 315W", category: "Brytere", unit: "stk", pricePerUnit: 385, coverage: 0 },
    { id: "elk-14", name: "Berøringsbryter smart", category: "Brytere", unit: "stk", pricePerUnit: 585, coverage: 0 },
    // Sikringsskap og automater
    { id: "elk-15", name: "Sikringsskap 36 moduler", category: "Sikringer", unit: "stk", pricePerUnit: 2850, coverage: 0 },
    { id: "elk-16", name: "Sikringsskap 54 moduler", category: "Sikringer", unit: "stk", pricePerUnit: 3850, coverage: 0 },
    { id: "elk-17", name: "Kursautomat 10A B-karakter", category: "Sikringer", unit: "stk", pricePerUnit: 125, coverage: 0 },
    { id: "elk-18", name: "Kursautomat 16A B-karakter", category: "Sikringer", unit: "stk", pricePerUnit: 125, coverage: 0 },
    { id: "elk-19", name: "Kursautomat 20A B-karakter", category: "Sikringer", unit: "stk", pricePerUnit: 135, coverage: 0 },
    { id: "elk-20", name: "Jordfeilbryter 40A 30mA", category: "Sikringer", unit: "stk", pricePerUnit: 485, coverage: 0 },
    { id: "elk-21", name: "Kombibryter 16A 30mA", category: "Sikringer", unit: "stk", pricePerUnit: 385, coverage: 0 },
    // Belysning
    { id: "elk-22", name: "LED-pære E27 9W", category: "Belysning", unit: "stk", pricePerUnit: 65, coverage: 0 },
    { id: "elk-23", name: "LED-pære GU10 5W", category: "Belysning", unit: "stk", pricePerUnit: 55, coverage: 0 },
    { id: "elk-24", name: "LED-stripe 5m RGB", category: "Belysning", unit: "sett", pricePerUnit: 385, coverage: 5 },
    { id: "elk-25", name: "Downlight LED 7W", category: "Belysning", unit: "stk", pricePerUnit: 185, coverage: 0 },
    { id: "elk-26", name: "Taklampe LED 24W", category: "Belysning", unit: "stk", pricePerUnit: 485, coverage: 0 },
    { id: "elk-27", name: "Spot armatur GU10", category: "Belysning", unit: "stk", pricePerUnit: 145, coverage: 0 },
    { id: "elk-28", name: "Lysrør LED 120cm 18W", category: "Belysning", unit: "stk", pricePerUnit: 165, coverage: 0 },
    // Doser og tilbehør
    { id: "elk-29", name: "Fordosesboks 65mm", category: "Doser", unit: "stk", pricePerUnit: 18, coverage: 0 },
    { id: "elk-30", name: "Veggboks 1-rom", category: "Doser", unit: "stk", pricePerUnit: 22, coverage: 0 },
    { id: "elk-31", name: "Veggboks 2-rom", category: "Doser", unit: "stk", pricePerUnit: 28, coverage: 0 },
    { id: "elk-32", name: "Kabelkanal 16x16mm hvit", category: "Tilbehør", unit: "m", pricePerUnit: 18, coverage: 1 },
    { id: "elk-33", name: "Rør flex PE 16mm", category: "Tilbehør", unit: "m", pricePerUnit: 12, coverage: 1 },
    { id: "elk-34", name: "Rør stiv PE 20mm", category: "Tilbehør", unit: "m", pricePerUnit: 15, coverage: 1 },
    { id: "elk-35", name: "Skjøtemuffe 3-pol", category: "Tilbehør", unit: "pk (10 stk)", pricePerUnit: 45, coverage: 0 },
  ],
  ror: [
    // Rør og koblinger
    { id: "ror-1", name: "Rør PEX 16mm", category: "Rør", unit: "m", pricePerUnit: 28, coverage: 1 },
    { id: "ror-2", name: "Rør PEX 20mm", category: "Rør", unit: "m", pricePerUnit: 38, coverage: 1 },
    { id: "ror-3", name: "Rør PEX 25mm", category: "Rør", unit: "m", pricePerUnit: 52, coverage: 1 },
    { id: "ror-4", name: "Avløpsrør 50mm grå", category: "Rør", unit: "m", pricePerUnit: 45, coverage: 1 },
    { id: "ror-5", name: "Avløpsrør 75mm grå", category: "Rør", unit: "m", pricePerUnit: 65, coverage: 1 },
    { id: "ror-6", name: "Avløpsrør 110mm grå", category: "Rør", unit: "m", pricePerUnit: 95, coverage: 1 },
    { id: "ror-7", name: "Kobling PEX 16mm", category: "Koblinger", unit: "stk", pricePerUnit: 35, coverage: 0 },
    { id: "ror-8", name: "Bend 90° 50mm avløp", category: "Koblinger", unit: "stk", pricePerUnit: 28, coverage: 0 },
    { id: "ror-9", name: "T-stykke 110mm avløp", category: "Koblinger", unit: "stk", pricePerUnit: 85, coverage: 0 },
    // Armaturer
    { id: "ror-10", name: "Vannkran kjøkken høy tut", category: "Armatur", unit: "stk", pricePerUnit: 1250, coverage: 0 },
    { id: "ror-11", name: "Vannkran kjøkken med uttrekk", category: "Armatur", unit: "stk", pricePerUnit: 1850, coverage: 0 },
    { id: "ror-12", name: "Blandebatteri dusj termostat", category: "Armatur", unit: "stk", pricePerUnit: 1650, coverage: 0 },
    { id: "ror-13", name: "Blandebatteri servant krom", category: "Armatur", unit: "stk", pricePerUnit: 985, coverage: 0 },
    { id: "ror-14", name: "Blandebatteri badekar", category: "Armatur", unit: "stk", pricePerUnit: 1385, coverage: 0 },
    { id: "ror-15", name: "Dusjhode regnfall 25cm", category: "Armatur", unit: "stk", pricePerUnit: 785, coverage: 0 },
    { id: "ror-16", name: "Dusjhode håndholdt", category: "Armatur", unit: "stk", pricePerUnit: 285, coverage: 0 },
    // Sanitærutstyr
    { id: "ror-17", name: "Toalett inkl. sete", category: "Sanitær", unit: "stk", pricePerUnit: 2850, coverage: 0 },
    { id: "ror-18", name: "Toalett vegghengt Geberit", category: "Sanitær", unit: "stk", pricePerUnit: 3850, coverage: 0 },
    { id: "ror-19", name: "Servant 60cm hvit", category: "Sanitær", unit: "stk", pricePerUnit: 1285, coverage: 0 },
    { id: "ror-20", name: "Servant 80cm hvit", category: "Sanitær", unit: "stk", pricePerUnit: 1685, coverage: 0 },
    { id: "ror-21", name: "Servantskap 60cm hvit", category: "Sanitær", unit: "stk", pricePerUnit: 2850, coverage: 0 },
    { id: "ror-22", name: "Badekar akryl 170cm", category: "Sanitær", unit: "stk", pricePerUnit: 4850, coverage: 0 },
    { id: "ror-23", name: "Dusjplate 90x90cm", category: "Sanitær", unit: "stk", pricePerUnit: 2450, coverage: 0 },
    { id: "ror-24", name: "Dusjplate 120x90cm", category: "Sanitær", unit: "stk", pricePerUnit: 3250, coverage: 0 },
    { id: "ror-25", name: "Dusjvegg 90cm klar glass", category: "Sanitær", unit: "stk", pricePerUnit: 3850, coverage: 0 },
    // Sluk og ventiler
    { id: "ror-26", name: "Sluk for dusjplate", category: "Sluk", unit: "stk", pricePerUnit: 450, coverage: 0 },
    { id: "ror-27", name: "Sluk for flislagt gulv", category: "Sluk", unit: "stk", pricePerUnit: 585, coverage: 0 },
    { id: "ror-28", name: "Stoppekran 1/2\"", category: "Ventiler", unit: "stk", pricePerUnit: 85, coverage: 0 },
    { id: "ror-29", name: "Lufteventil automatisk", category: "Ventiler", unit: "stk", pricePerUnit: 125, coverage: 0 },
    // Gulvvarme
    { id: "ror-30", name: "Gulvvarme matte 1m²", category: "Varme", unit: "m²", pricePerUnit: 520, coverage: 1 },
    { id: "ror-31", name: "Gulvvarme matte 2m²", category: "Varme", unit: "stk", pricePerUnit: 985, coverage: 2 },
    { id: "ror-32", name: "Gulvvarme matte 3m²", category: "Varme", unit: "stk", pricePerUnit: 1450, coverage: 3 },
    { id: "ror-33", name: "Gulvvarme termostat digital", category: "Varme", unit: "stk", pricePerUnit: 785, coverage: 0 },
    { id: "ror-34", name: "Gulvvarme termostat WiFi", category: "Varme", unit: "stk", pricePerUnit: 1285, coverage: 0 },
    // Fliser og membran
    { id: "ror-35", name: "Baderomsmembran", category: "Membran", unit: "m²", pricePerUnit: 185, coverage: 1 },
    { id: "ror-36", name: "Våtromstette komplett sett", category: "Membran", unit: "sett", pricePerUnit: 2850, coverage: 0 },
    { id: "ror-37", name: "Flislim weber", category: "Tilbehør", unit: "sekk 15kg", pricePerUnit: 285, coverage: 5 },
    { id: "ror-38", name: "Fugemasse weber hvit", category: "Tilbehør", unit: "sekk 5kg", pricePerUnit: 185, coverage: 10 },
    { id: "ror-39", name: "Sluk komplett sett Purus", category: "Sluk", unit: "stk", pricePerUnit: 785, coverage: 0 },
    // Tilbehør
    { id: "ror-40", name: "Vaskemaskinventil 3/4\"", category: "Tilbehør", unit: "stk", pricePerUnit: 145, coverage: 0 },
    { id: "ror-41", name: "Oppvaskmaskinventil 3/4\"", category: "Tilbehør", unit: "stk", pricePerUnit: 165, coverage: 0 },
    { id: "ror-42", name: "Innfellingsslange vaskemaskin", category: "Tilbehør", unit: "stk", pricePerUnit: 185, coverage: 0 },
    { id: "ror-43", name: "Varmtvannsbereder 80L", category: "Tilbehør", unit: "stk", pricePerUnit: 4850, coverage: 0 },
  ],
};

interface Material {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number;
  coverage: number;
}

interface SelectedMaterial extends Material {
  quantity: number;
  totalPrice: number;
}

interface Calculator {
  type: string;
  area?: number;
  length?: number;
  items: CalculatorItem[];
}

interface CalculatorItem {
  name: string;
  quantity: number;
  unit: string;
}

interface JobDetails {
  id: string;
  customerId: string;
  category: string;
  title: string;
  description: string;
  location: string;
  budgetMin?: number;
  budgetMax?: number;
}

export function OfferBuilder() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const isPro = searchParams.get("plan") === "pro"; // Check if user is Pro subscriber

  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"materials" | "calculator">("materials");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMaterials, setSelectedMaterials] = useState<SelectedMaterial[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);

  // Custom material modal
  const [showCustomMaterialModal, setShowCustomMaterialModal] = useState(false);
  const [customMaterialName, setCustomMaterialName] = useState("");
  const [customMaterialCategory, setCustomMaterialCategory] = useState("");
  const [customMaterialUnit, setCustomMaterialUnit] = useState("stk");
  const [customMaterialPrice, setCustomMaterialPrice] = useState("");

  // Price edit modal
  const [showPriceEditModal, setShowPriceEditModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editedPrice, setEditedPrice] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");

  // Calculator state
  const [calculatorType, setCalculatorType] = useState<"roof" | "painting" | "flooring">("roof");
  const [calcArea, setCalcArea] = useState("");
  const [calcLength, setCalcLength] = useState("");
  const [calcWidth, setCalcWidth] = useState("");
  const [calcResults, setCalcResults] = useState<CalculatorItem[]>([]);
  
  // Advanced roof calculator state
  const [roofType, setRoofType] = useState<"saltak" | "valm">("saltak");
  const [roofAngle, setRoofAngle] = useState("");
  const [roofHeight, setRoofHeight] = useState("");
  const [roofBase, setRoofBase] = useState("");
  const [tileType, setTileType] = useState("monier"); // Type takstein
  const [useAngleCalc, setUseAngleCalc] = useState(false);

  // Advanced flooring calculator state
  const [floorType, setFloorType] = useState<"laminat" | "parkett" | "vinyl">("laminat");
  const [layingPattern, setLayingPattern] = useState<"rett" | "diagonal" | "fiskeben">("rett");
  const [includeBaseboards, setIncludeBaseboards] = useState(true);
  const [includeTransition, setIncludeTransition] = useState(true);
  const [includeMoisture, setIncludeMoisture] = useState(false);
  const [numberOfDoors, setNumberOfDoors] = useState("1");

  // Offer details
  const [offerDescription, setOfferDescription] = useState("");
  const [timeline, setTimeline] = useState("");
  const [warranty, setWarranty] = useState("2 år garanti");
  const [laborCost, setLaborCost] = useState("");
  const [paymentOption, setPaymentOption] = useState<"upfront" | "postpaid">("postpaid");
  const [depositPercentage, setDepositPercentage] = useState(50);

  // Demo mode for testing Pro features
  const [demoProMode, setDemoProMode] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-8d200dba/requests/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load job details");
      }

      const data = await response.json();
      setJob(data.request);
    } catch (error) {
      console.error("Error loading job:", error);
      alert("Kunne ikke laste jobbdetaljer");
      navigate("/tilgjengelige-jobber");
    } finally {
      setLoading(false);
    }
  };

  // Get all materials from database
  const getAllMaterials = (): Material[] => {
    return Object.values(MATERIAL_DATABASE).flat();
  };

  // Filter materials based on search and category
  const getFilteredMaterials = (): Material[] => {
    let materials = selectedCategory === "all" 
      ? getAllMaterials() 
      : MATERIAL_DATABASE[selectedCategory as keyof typeof MATERIAL_DATABASE] || [];

    if (searchQuery) {
      materials = materials.filter((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return materials;
  };

  const addMaterial = (material: Material) => {
    // Open price edit modal for adding material
    setEditingMaterial(material);
    setEditedPrice(material.pricePerUnit.toString());
    setEditedQuantity("1");
    setShowPriceEditModal(true);
  };

  const confirmAddMaterial = () => {
    if (!editingMaterial) return;

    const price = parseFloat(editedPrice) || editingMaterial.pricePerUnit;
    const quantity = parseFloat(editedQuantity) || 1;

    const existing = selectedMaterials.find((m) => m.id === editingMaterial.id);
    if (existing) {
      // Update existing material - replace values instead of adding
      setSelectedMaterials(
        selectedMaterials.map((m) =>
          m.id === editingMaterial.id
            ? { ...m, pricePerUnit: price, quantity: quantity, totalPrice: price * quantity }
            : m
        )
      );
    } else {
      // Add new material
      setSelectedMaterials([
        ...selectedMaterials,
        { ...editingMaterial, pricePerUnit: price, quantity, totalPrice: price * quantity },
      ]);
    }

    setShowPriceEditModal(false);
    setEditingMaterial(null);
    setEditedPrice("");
    setEditedQuantity("");
  };

  const updateMaterialQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeMaterial(id);
      return;
    }
    setSelectedMaterials(
      selectedMaterials.map((m) =>
        m.id === id
          ? { ...m, quantity, totalPrice: m.pricePerUnit * quantity }
          : m
      )
    );
  };

  const updateMaterialPrice = (id: string, newPrice: number) => {
    setSelectedMaterials(
      selectedMaterials.map((m) =>
        m.id === id
          ? { ...m, pricePerUnit: newPrice, totalPrice: newPrice * m.quantity }
          : m
      )
    );
  };

  const removeMaterial = (id: string) => {
    setSelectedMaterials(selectedMaterials.filter((m) => m.id !== id));
  };

  const openCustomMaterialModal = () => {
    setCustomMaterialName(searchQuery);
    setCustomMaterialCategory("Annet");
    setCustomMaterialUnit("stk");
    setCustomMaterialPrice("");
    setShowCustomMaterialModal(true);
  };

  const createCustomMaterial = () => {
    if (!customMaterialName.trim()) {
      alert("Vennligst oppgi produktnavn");
      return;
    }

    const price = parseFloat(customMaterialPrice);
    if (!price || price <= 0) {
      alert("Vennligst oppgi gyldig pris");
      return;
    }

    const customMaterial: Material = {
      id: `custom-${Date.now()}`,
      name: customMaterialName,
      category: customMaterialCategory || "Annet",
      unit: customMaterialUnit,
      pricePerUnit: price,
      coverage: 0,
    };

    setSelectedMaterials([
      ...selectedMaterials,
      { ...customMaterial, quantity: 1, totalPrice: price },
    ]);

    setShowCustomMaterialModal(false);
    setCustomMaterialName("");
    setCustomMaterialCategory("");
    setCustomMaterialUnit("stk");
    setCustomMaterialPrice("");
  };

  // Calculator functions
  const calculateRoofMaterials = () => {
    // Calculate area from L x B if provided, otherwise use direct area input
    let area = parseFloat(calcArea);
    const length = parseFloat(calcLength);
    const width = parseFloat(calcWidth);
    
    if (length > 0 && width > 0) {
      area = length * width;
    }
    
    if (!area || area <= 0) {
      alert("Vennligst oppgi gyldig areal (direkte eller via Lengde x Bredde)");
      return;
    }

    // Calculate roof angle if using height method
    let angle = parseFloat(roofAngle);
    if (useAngleCalc) {
      const height = parseFloat(roofHeight);
      const base = parseFloat(roofBase);
      if (height > 0 && base > 0) {
        // Calculate angle using arctan
        angle = Math.atan(height / (base / 2)) * (180 / Math.PI);
      } else {
        alert("Vennligst oppgi høyde og bredde for vinkelberegning");
        return;
      }
    } else if (!angle || angle <= 0) {
      alert("Vennligst oppgi takvinkel");
      return;
    }

    // Adjust area based on roof angle (slope correction)
    const slopeFactor = 1 / Math.cos(angle * Math.PI / 180);
    const adjustedArea = area * slopeFactor;

    const results: CalculatorItem[] = [];

    // Takstein calculation based on type
    let tilesPerSqm = 10; // Default
    let tileCoverage = 0.33; // m² per tile
    
    switch (tileType) {
      case "monier":
        tilesPerSqm = 10;
        tileCoverage = 0.33;
        break;
      case "optimal":
        tilesPerSqm = 10;
        tileCoverage = 0.33;
        break;
      case "braas":
        tilesPerSqm = 9.5;
        tileCoverage = 0.35;
        break;
    }

    const fullTiles = Math.ceil(adjustedArea * tilesPerSqm * 0.85); // 85% full tiles
    const halfTiles = Math.ceil(adjustedArea * tilesPerSqm * 0.10); // 10% half tiles
    const endTiles = Math.ceil(length * 2 / 0.33); // End tiles along ridge

    results.push({ name: "Fullsten", quantity: fullTiles, unit: "stk" });
    results.push({ name: "Halvsten", quantity: halfTiles, unit: "stk" });
    results.push({ name: "Endesten", quantity: endTiles, unit: "stk" });

    // Mønestein calculation (for ridge and hips)
    let ridgeLength = length; // Ridge length
    if (roofType === "valm") {
      // Valm roof has hips as well
      const hipLength = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(length / 2, 2)) * 2;
      ridgeLength += hipLength;
    }
    const ridgeTiles = Math.ceil(ridgeLength / 0.33); // ~3 tiles per meter
    results.push({ name: "Mønestein", quantity: ridgeTiles, unit: "stk" });

    // Stormklips (10 per m²)
    const stormClips = Math.ceil(adjustedArea * tilesPerSqm);
    results.push({ name: "Stormklips", quantity: stormClips, unit: "stk" });

    // Takrenner calculation
    let gutterLength = 0;
    if (roofType === "saltak") {
      // Saltak: gutters on both long sides
      gutterLength = length * 2;
    } else if (roofType === "valm") {
      // Valm: gutters on all four sides
      gutterLength = (length + width) * 2;
    }
    results.push({ name: "Takrenner", quantity: Math.ceil(gutterLength), unit: "m" });

    // Undertak (adjusted area + 10% waste)
    results.push({ name: "Undertak", quantity: Math.ceil(adjustedArea * 1.1), unit: "m²" });

    // Lekter calculation (horizontal battens)
    const lekterSpacing = 0.35; // 35cm spacing
    const numberOfLekter = Math.ceil((width * slopeFactor) / lekterSpacing);
    const lekterLength = numberOfLekter * length;
    results.push({ name: "Lekter 36x48mm", quantity: Math.ceil(lekterLength), unit: "m" });

    // Add calculated angle to results for display
    results.push({ name: "Beregnet vinkel", quantity: Math.round(angle * 10) / 10, unit: "grader" });

    setCalcResults(results);
    setShowCalculator(false);

    // Auto-add materials
    autoAddCalculatedMaterials(results);
  };

  const calculatePaintingMaterials = () => {
    const area = parseFloat(calcArea);
    if (!area || area <= 0) {
      alert("Vennligst oppgi gyldig areal");
      return;
    }

    const results: CalculatorItem[] = [];

    // Paint (coverage: 10m² per liter)
    const paintLiters = Math.ceil(area / 10);
    results.push({ name: "Maling", quantity: paintLiters, unit: "liter" });

    // Primer (coverage: 8m² per liter)
    const primerLiters = Math.ceil(area / 8);
    results.push({ name: "Grunning", quantity: primerLiters, unit: "liter" });

    setCalcResults(results);
    setShowCalculator(false);
    autoAddCalculatedMaterials(results);
  };

  const calculateFlooringMaterials = () => {
    // Calculate area from L x B if provided, otherwise use direct area input
    let area = parseFloat(calcArea);
    const length = parseFloat(calcLength);
    const width = parseFloat(calcWidth);
    
    if (length > 0 && width > 0) {
      area = length * width;
    }
    
    if (!area || area <= 0) {
      alert("Vennligst oppgi gyldig areal (direkte eller via Lengde x Bredde)");
      return;
    }

    const results: CalculatorItem[] = [];

    // Calculate waste percentage based on laying pattern
    let wastePercentage = 0.05; // Default 5%
    let patternName = "";
    
    switch (layingPattern) {
      case "rett":
        wastePercentage = 0.07; // 7% waste for straight laying
        patternName = "rett legging";
        break;
      case "diagonal":
        wastePercentage = 0.12; // 12% waste for diagonal
        patternName = "diagonal legging";
        break;
      case "fiskeben":
        wastePercentage = 0.18; // 18% waste for herringbone
        patternName = "fiskeben";
        break;
    }

    // Flooring with waste
    const flooringWithWaste = Math.ceil(area * (1 + wastePercentage) * 10) / 10;
    
    // Floor type specific naming
    let floorTypeName = "";
    switch (floorType) {
      case "laminat":
        floorTypeName = "Laminatgulv";
        break;
      case "parkett":
        floorTypeName = "Parkettgulv";
        break;
      case "vinyl":
        floorTypeName = "Vinylgulv";
        break;
    }
    
    results.push({ 
      name: `${floorTypeName} (${patternName})`, 
      quantity: flooringWithWaste, 
      unit: "m²" 
    });

    // Underlayment (1:1 with flooring area + waste)
    const underlayment = Math.ceil(area * (1 + wastePercentage) * 10) / 10;
    results.push({ name: "Gulvunderlag", quantity: underlayment, unit: "m²" });

    // Moisture barrier (if selected)
    if (includeMoisture) {
      const moistureBarrier = Math.ceil(area * 1.05 * 10) / 10; // 5% overlap
      results.push({ name: "Dampsperre", quantity: moistureBarrier, unit: "m²" });
    }

    // Baseboards (perimeter calculation)
    if (includeBaseboards && length > 0 && width > 0) {
      const perimeter = (length + width) * 2;
      results.push({ name: "Gulvlist", quantity: Math.ceil(perimeter), unit: "m" });
      
      // Corner joints (4 inner corners typically)
      results.push({ name: "Hjørnelister", quantity: 4, unit: "stk" });
      
      // End caps for baseboards
      results.push({ name: "Endestykker", quantity: 4, unit: "stk" });
    }

    // Transition strips
    if (includeTransition) {
      const doors = parseInt(numberOfDoors) || 1;
      results.push({ name: "Overgangslist", quantity: doors, unit: "stk" });
    }

    // Adhesive/glue (for certain floor types)
    if (floorType === "vinyl" || floorType === "parkett") {
      const glueBottles = Math.ceil(area / 15); // ~15m² per bottle/bucket
      results.push({ name: "Gulvlim", quantity: glueBottles, unit: "stk" });
    }

    // Add info about waste percentage used
    results.push({ 
      name: "Kapp/svinn", 
      quantity: Math.round(wastePercentage * 100), 
      unit: "%" 
    });

    setCalcResults(results);
    setShowCalculator(false);
    autoAddCalculatedMaterials(results);
  };

  const autoAddCalculatedMaterials = (results: CalculatorItem[]) => {
    // This would match calculated items with materials in the database
    // For now, just show the results
    alert(`Kalkulert mengder:\n${results.map(r => `${r.name}: ${r.quantity} ${r.unit}`).join('\n')}`);
  };

  // Calculate totals
  const materialsCost = selectedMaterials.reduce((sum, m) => sum + m.totalPrice, 0);
  const laborCostNum = parseFloat(laborCost) || 0;
  const subtotal = materialsCost + laborCostNum;
  const mva = subtotal * 0.25;
  const totalPrice = subtotal + mva;

  const handleGenerateWithAI = () => {
    if (!isPro && !demoProMode) {
      alert("AI-assistent er kun tilgjengelig for Pro-kunder");
      return;
    }

    // AI would generate a description based on job details and selected materials
    const aiDescription = `Basert på prosjektet "${job?.title}" vil jeg:

1. Fjerne eksisterende materialer
2. Installere ${selectedMaterials.length > 0 ? selectedMaterials.map(m => `${m.quantity} ${m.unit} ${m.name}`).join(', ') : 'nødvendige materialer'}
3. Kvalitetssikre alt arbeid
4. Rydde opp etter endt arbeid

Alle materialer er inkludert i prisen. Jeg bruker kun materialer av høy kvalitet og arbeidet utføres i henhold til gjeldende forskrifter.`;

    setOfferDescription(aiDescription);
    setShowAIAssistant(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-[#6B7280]">Laster...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header variant="simple" title="Opprett detaljert tilbud" onBack={() => navigate(-1)} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Materials & Calculator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Summary */}
            {job && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <h2 className="text-xl font-bold text-[#111827] mb-2">{job.title}</h2>
                <p className="text-sm text-[#6B7280] mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-[#6B7280]">
                  <span>📍 {job.location}</span>
                  {job.budgetMax && (
                    <span>
                      💰 {job.budgetMin?.toLocaleString("nb-NO")} - {job.budgetMax.toLocaleString("nb-NO")} kr
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-2 flex gap-2">
              <button
                onClick={() => setActiveTab("materials")}
                className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
                  activeTab === "materials"
                    ? "bg-[#17384E] text-white"
                    : "text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Materialer
              </button>
              <button
                onClick={() => setActiveTab("calculator")}
                className={`flex-1 h-10 rounded-lg font-medium transition-colors ${
                  activeTab === "calculator"
                    ? "bg-[#17384E] text-white"
                    : "text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                Kalkulator
              </button>
            </div>

            {/* Materials Tab */}
            {activeTab === "materials" && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-[#111827] mb-4">Søk etter materialer</h3>
                  
                  {/* Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Søk etter materialer (f.eks. takstein, maling, panel...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "tak", label: "Tak" },
                      { id: "maling", label: "Maling" },
                      { id: "trevare", label: "Tømrer/Trevare" },
                      { id: "elektrisk", label: "Elektriker" },
                      { id: "ror", label: "Rørlegger" },
                      { id: "all", label: "Alle" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === cat.id
                            ? "bg-[#17384E] text-white"
                            : "bg-gray-100 text-[#6B7280] hover:bg-gray-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Add Custom Material Button */}
                  <button
                    onClick={openCustomMaterialModal}
                    className="w-full mt-2 h-10 border-2 border-dashed border-[#E5E7EB] text-[#6B7280] rounded-lg hover:border-[#17384E] hover:text-[#17384E] transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Legg til egendefinert produkt
                  </button>
                </div>

                {/* Materials List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {getFilteredMaterials().map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg hover:border-[#17384E] transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-[#111827]">{material.name}</div>
                        <div className="text-sm text-[#6B7280]">
                          {material.category} • {material.pricePerUnit} kr/{material.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => addMaterial(material)}
                        className="h-8 px-4 bg-[#E07B3E] text-white rounded-lg hover:bg-[#d16f35] transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Legg til
                      </button>
                    </div>
                  ))}
                  {getFilteredMaterials().length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-[#6B7280] mb-4">Ingen materialer funnet</div>
                      <button
                        onClick={openCustomMaterialModal}
                        className="h-10 px-6 bg-[#17384E] text-white rounded-lg hover:bg-[#1a4459] transition-colors flex items-center gap-2 mx-auto text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Legg til egendefinert produkt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Calculator Tab */}
            {activeTab === "calculator" && (
              <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
                <h3 className="text-lg font-bold text-[#111827] mb-4">Mengdekalkulator</h3>
                
                {/* Calculator Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#111827] mb-3">
                    Velg type beregning
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setCalculatorType("roof")}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        calculatorType === "roof"
                          ? "border-[#17384E] bg-[#17384E]/5"
                          : "border-[#E5E7EB] hover:border-[#17384E]/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">🏠</div>
                      <div className="font-medium text-sm">Tak</div>
                    </button>
                    <button
                      onClick={() => setCalculatorType("painting")}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        calculatorType === "painting"
                          ? "border-[#17384E] bg-[#17384E]/5"
                          : "border-[#E5E7EB] hover:border-[#17384E]/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">🎨</div>
                      <div className="font-medium text-sm">Maling</div>
                    </button>
                    <button
                      onClick={() => setCalculatorType("flooring")}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        calculatorType === "flooring"
                          ? "border-[#17384E] bg-[#17384E]/5"
                          : "border-[#E5E7EB] hover:border-[#17384E]/50"
                      }`}
                    >
                      <div className="text-2xl mb-2">📐</div>
                      <div className="font-medium text-sm">Gulv</div>
                    </button>
                  </div>
                </div>

                {/* Roof Calculator */}
                {calculatorType === "roof" && (
                  <div className="space-y-4">
                    {/* Roof Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type tak
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setRoofType("saltak")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            roofType === "saltak"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-sm">Saltak</div>
                        </button>
                        <button
                          onClick={() => setRoofType("valm")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            roofType === "valm"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-sm">Valmtak</div>
                        </button>
                      </div>
                    </div>

                    {/* Tile Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type takstein
                      </label>
                      <select
                        value={tileType}
                        onChange={(e) => setTileType(e.target.value)}
                        className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                      >
                        <option value="monier">Monier Novo (10 stk/m²)</option>
                        <option value="optimal">Optimal Protector (10 stk/m²)</option>
                        <option value="braas">Braas Turmalin (9.5 stk/m²)</option>
                      </select>
                    </div>

                    {/* Area Input Options */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-3">
                        Areal (velg én metode)
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#6B7280] mb-1">
                            Direkte areal (m²)
                          </label>
                          <input
                            type="number"
                            placeholder="f.eks. 150"
                            value={calcArea}
                            onChange={(e) => setCalcArea(e.target.value)}
                            className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                          />
                        </div>

                        <div className="text-center text-xs text-[#6B7280]">eller</div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Lengde (m)
                            </label>
                            <input
                              type="number"
                              placeholder="f.eks. 15"
                              value={calcLength}
                              onChange={(e) => setCalcLength(e.target.value)}
                              className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Bredde (m)
                            </label>
                            <input
                              type="number"
                              placeholder="f.eks. 10"
                              value={calcWidth}
                              onChange={(e) => setCalcWidth(e.target.value)}
                              className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Angle Input Options */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-[#111827]">
                          Takvinkel
                        </div>
                        <button
                          onClick={() => setUseAngleCalc(!useAngleCalc)}
                          className="text-xs text-[#E07B3E] hover:underline"
                        >
                          {useAngleCalc ? "Oppgi direkte" : "Beregn fra høyde"}
                        </button>
                      </div>

                      {!useAngleCalc ? (
                        <div>
                          <label className="block text-xs text-[#6B7280] mb-1">
                            Vinkel (grader)
                          </label>
                          <input
                            type="number"
                            placeholder="f.eks. 25"
                            value={roofAngle}
                            onChange={(e) => setRoofAngle(e.target.value)}
                            className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-[#F3F4F6] rounded p-2 text-xs text-[#6B7280]">
                            Beregner vinkel fra høydeforskjell (bunn til topp av møne)
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-[#6B7280] mb-1">
                                Høyde (m)
                              </label>
                              <input
                                type="number"
                                placeholder="f.eks. 2.5"
                                value={roofHeight}
                                onChange={(e) => setRoofHeight(e.target.value)}
                                className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-[#6B7280] mb-1">
                                Bredde/base (m)
                              </label>
                              <input
                                type="number"
                                placeholder="f.eks. 10"
                                value={roofBase}
                                onChange={(e) => setRoofBase(e.target.value)}
                                className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-2">
                        Kalkulatoren beregner:
                      </div>
                      <ul className="text-xs text-[#6B7280] space-y-1">
                        <li>✓ Fullsten, Halvsten, Endesten</li>
                        <li>✓ Mønestein (mønelengde basert på taktype)</li>
                        <li>✓ Stormklips (per takstein)</li>
                        <li>✓ Takrenner (beregnet omkrets)</li>
                        <li>✓ Undertak (justert for takvinkel)</li>
                        <li>✓ Lekter (med 35cm avstand)</li>
                      </ul>
                    </div>

                    <button
                      onClick={calculateRoofMaterials}
                      className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
                    >
                      Beregn materialer
                    </button>

                    {/* Results Display */}
                    {calcResults.length > 0 && (
                      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                        <div className="text-sm font-semibold text-[#111827] mb-3">
                          Kalkulerte mengder:
                        </div>
                        <div className="space-y-2">
                          {calcResults.map((result, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 px-3 bg-[#F3F4F6] rounded-lg"
                            >
                              <span className="text-sm text-[#111827] font-medium">
                                {result.name}
                              </span>
                              <span className="text-sm text-[#E07B3E] font-bold">
                                {result.quantity} {result.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Painting Calculator */}
                {calculatorType === "painting" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Maleareal (m²)
                      </label>
                      <input
                        type="number"
                        placeholder="f.eks. 80"
                        value={calcArea}
                        onChange={(e) => setCalcArea(e.target.value)}
                        className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                      />
                    </div>

                    <div className="bg-[#F3F4F6] rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-2">
                        Automatisk beregning inkluderer:
                      </div>
                      <ul className="text-sm text-[#6B7280] space-y-1">
                        <li>• Maling (dekningsgrad: 10m² per liter)</li>
                        <li>• Grunning (dekningsgrad: 8m² per liter)</li>
                      </ul>
                    </div>

                    <button
                      onClick={calculatePaintingMaterials}
                      className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
                    >
                      Beregn materialer
                    </button>
                  </div>
                )}

                {/* Flooring Calculator */}
                {calculatorType === "flooring" && (
                  <div className="space-y-4">
                    {/* Floor Type */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Type gulv
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setFloorType("laminat")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            floorType === "laminat"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Laminat</div>
                        </button>
                        <button
                          onClick={() => setFloorType("parkett")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            floorType === "parkett"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Parkett</div>
                        </button>
                        <button
                          onClick={() => setFloorType("vinyl")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            floorType === "vinyl"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-xs">Vinyl</div>
                        </button>
                      </div>
                    </div>

                    {/* Laying Pattern */}
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-2">
                        Leggingsmønster
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setLayingPattern("rett")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            layingPattern === "rett"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-2xl mb-1">━</div>
                          <div className="text-xs">Rett</div>
                          <div className="text-xs text-[#6B7280]">7% kapp</div>
                        </button>
                        <button
                          onClick={() => setLayingPattern("diagonal")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            layingPattern === "diagonal"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-2xl mb-1">╱</div>
                          <div className="text-xs">Diagonal</div>
                          <div className="text-xs text-[#6B7280]">12% kapp</div>
                        </button>
                        <button
                          onClick={() => setLayingPattern("fiskeben")}
                          className={`p-3 border-2 rounded-lg transition-colors ${
                            layingPattern === "fiskeben"
                              ? "border-[#17384E] bg-[#17384E]/5 font-semibold"
                              : "border-[#E5E7EB] hover:border-[#17384E]/50"
                          }`}
                        >
                          <div className="text-2xl mb-1">⋮</div>
                          <div className="text-xs">Fiskeben</div>
                          <div className="text-xs text-[#6B7280]">18% kapp</div>
                        </button>
                      </div>
                    </div>

                    {/* Area Input Options */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-3">
                        Areal (velg én metode)
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-[#6B7280] mb-1">
                            Direkte areal (m²)
                          </label>
                          <input
                            type="number"
                            placeholder="f.eks. 60"
                            value={calcArea}
                            onChange={(e) => setCalcArea(e.target.value)}
                            className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                          />
                        </div>

                        <div className="text-center text-xs text-[#6B7280]">eller</div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Lengde (m)
                            </label>
                            <input
                              type="number"
                              placeholder="f.eks. 10"
                              value={calcLength}
                              onChange={(e) => setCalcLength(e.target.value)}
                              className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Bredde (m)
                            </label>
                            <input
                              type="number"
                              placeholder="f.eks. 6"
                              value={calcWidth}
                              onChange={(e) => setCalcWidth(e.target.value)}
                              className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Options */}
                    <div className="border border-[#E5E7EB] rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-3">
                        Ekstra komponenter
                      </div>
                      
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeBaseboards}
                            onChange={(e) => setIncludeBaseboards(e.target.checked)}
                            className="w-5 h-5 rounded border-[#E5E7EB] text-[#17384E] focus:ring-2 focus:ring-[#17384E]"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#111827]">Gulvlister</div>
                            <div className="text-xs text-[#6B7280]">Beregner omkrets + hjørner</div>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeTransition}
                            onChange={(e) => setIncludeTransition(e.target.checked)}
                            className="w-5 h-5 rounded border-[#E5E7EB] text-[#17384E] focus:ring-2 focus:ring-[#17384E]"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#111827]">Overgangslister</div>
                            <div className="text-xs text-[#6B7280]">For dører og rom-overganger</div>
                          </div>
                        </label>

                        {includeTransition && (
                          <div className="ml-8">
                            <label className="block text-xs text-[#6B7280] mb-1">
                              Antall dører/overganger
                            </label>
                            <input
                              type="number"
                              placeholder="1"
                              value={numberOfDoors}
                              onChange={(e) => setNumberOfDoors(e.target.value)}
                              className="w-24 h-8 px-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
                            />
                          </div>
                        )}

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeMoisture}
                            onChange={(e) => setIncludeMoisture(e.target.checked)}
                            className="w-5 h-5 rounded border-[#E5E7EB] text-[#17384E] focus:ring-2 focus:ring-[#17384E]"
                          />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-[#111827]">Dampsperre</div>
                            <div className="text-xs text-[#6B7280]">For betongunderlag</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-[#111827] mb-2">
                        Kalkulatoren beregner:
                      </div>
                      <ul className="text-xs text-[#6B7280] space-y-1">
                        <li>✓ Gulvareal med smart kapp-% (basert på mønster)</li>
                        <li>✓ Gulvunderlag (1:1 med gulv)</li>
                        {includeBaseboards && <li>✓ Gulvlister, hjørner og endestykker</li>}
                        {includeTransition && <li>✓ Overgangslister</li>}
                        {includeMoisture && <li>✓ Dampsperre med overlapp</li>}
                        {(floorType === "vinyl" || floorType === "parkett") && <li>✓ Gulvlim (ca. 15m² per enhet)</li>}
                      </ul>
                    </div>

                    <button
                      onClick={calculateFlooringMaterials}
                      className="w-full h-12 bg-[#17384E] text-white rounded-lg font-semibold hover:bg-[#1a4459] transition-colors"
                    >
                      Beregn materialer
                    </button>

                    {/* Results Display */}
                    {calcResults.length > 0 && (
                      <div className="border-t border-[#E5E7EB] pt-4 mt-4">
                        <div className="text-sm font-semibold text-[#111827] mb-3">
                          Kalkulerte mengder:
                        </div>
                        <div className="space-y-2">
                          {calcResults.map((result, index) => (
                            <div
                              key={index}
                              className={`flex justify-between items-center py-2 px-3 rounded-lg ${
                                result.unit === "%" 
                                  ? "bg-[#E07B3E]/10 border border-[#E07B3E]/20" 
                                  : "bg-[#F3F4F6]"
                              }`}
                            >
                              <span className="text-sm text-[#111827] font-medium">
                                {result.name}
                              </span>
                              <span className="text-sm text-[#E07B3E] font-bold">
                                {result.quantity} {result.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Selected Materials & Offer */}
          <div className="space-y-6">
            {/* Selected Materials */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-bold text-[#111827] mb-4">
                Valgte materialer ({selectedMaterials.length})
              </h3>

              {selectedMaterials.length === 0 ? (
                <div className="text-center py-8 text-[#6B7280] text-sm">
                  Ingen materialer valgt ennå
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="border border-[#E5E7EB] rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-sm text-[#111827]">
                            {material.name}
                          </div>
                          <button
                            onClick={() => {
                              setEditingMaterial(material);
                              setEditedPrice(material.pricePerUnit.toString());
                              setEditedQuantity(material.quantity.toString());
                              setShowPriceEditModal(true);
                            }}
                            className="text-xs text-[#E07B3E] hover:underline mt-1"
                          >
                            {material.pricePerUnit} kr/{material.unit} • Rediger pris
                          </button>
                        </div>
                        <button
                          onClick={() => removeMaterial(material.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          value={material.quantity}
                          onChange={(e) =>
                            updateMaterialQuantity(material.id, parseInt(e.target.value))
                          }
                          className="w-20 h-8 px-2 border border-[#E5E7EB] rounded text-sm text-center"
                        />
                        <span className="text-sm text-[#6B7280]">{material.unit}</span>
                        <span className="ml-auto text-sm font-medium text-[#111827]">
                          {material.totalPrice.toLocaleString("nb-NO")} kr
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Material Cost Summary */}
              {selectedMaterials.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-[#6B7280]">Materialer totalt</span>
                    <span className="text-[#111827]">
                      {materialsCost.toLocaleString("nb-NO")} kr
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Labor Cost */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-bold text-[#111827] mb-4">Arbeidskostnad</h3>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
                <input
                  type="number"
                  placeholder="15000"
                  value={laborCost}
                  onChange={(e) => setLaborCost(e.target.value)}
                  className="w-full h-12 pl-10 pr-16 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  kr
                </span>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-[#F3F4F6] rounded-lg p-6">
              <h4 className="font-semibold text-[#111827] mb-4">Prisoppsummering</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Materialer</span>
                  <span className="font-medium text-[#111827]">
                    {materialsCost.toLocaleString("nb-NO")} kr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Arbeid</span>
                  <span className="font-medium text-[#111827]">
                    {laborCostNum.toLocaleString("nb-NO")} kr
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">MVA (25%)</span>
                  <span className="font-medium text-[#111827]">
                    {mva.toLocaleString("nb-NO")} kr
                  </span>
                </div>
                <div className="border-t border-[#E5E7EB] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#111827]">Total</span>
                    <span className="font-bold text-[#17384E] text-lg">
                      {totalPrice.toLocaleString("nb-NO")} kr
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Offer Details */}
            <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#111827]">Tilbudsbeskrivelse</h3>
                {isPro || demoProMode ? (
                  <button
                    onClick={() => setShowAIAssistant(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#17384E] to-[#2a5570] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Brain className="w-4 h-4" />
                    AI-assistent
                  </button>
                ) : (
                  <button
                    onClick={() => setDemoProMode(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#17384E] to-[#2a5570] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Brain className="w-4 h-4" />
                    Test AI-assistent
                  </button>
                )}
              </div>

              <textarea
                placeholder="Beskriv hvordan du vil utføre jobben, hva som er inkludert, osv."
                value={offerDescription}
                onChange={(e) => setOfferDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#17384E] text-sm"
              />

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Tidsramme
                  </label>
                  <input
                    type="text"
                    placeholder="f.eks. 2-3 dager"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Garanti
                  </label>
                  <input
                    type="text"
                    placeholder="f.eks. 2 år garanti"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full h-10 px-3 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => alert("Tilbud sendt! (demo)")}
              className="w-full h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Send tilbud
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAIAssistant(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#17384E] to-[#2a5570] rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#111827]">AI Tilbudsassistent</h2>
                  <p className="text-sm text-[#6B7280]">Eksklusiv for Pro-kunder</p>
                </div>
              </div>
              <button
                onClick={() => setShowAIAssistant(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-[#F3F4F6] rounded-lg p-4 mb-4">
                <div className="text-sm text-[#6B7280] mb-2">AI vil generere en profesjonell beskrivelse basert på:</div>
                <ul className="text-sm text-[#111827] space-y-1">
                  <li>• Jobbdetaljer: {job?.title}</li>
                  <li>• Valgte materialer: {selectedMaterials.length} materialer</li>
                  <li>• Total pris: {totalPrice.toLocaleString("nb-NO")} kr</li>
                </ul>
              </div>

              <button
                onClick={handleGenerateWithAI}
                className="w-full h-12 bg-gradient-to-r from-[#17384E] to-[#2a5570] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generer tilbudsbeskrivelse
              </button>
            </div>

            <div className="text-xs text-[#6B7280]">
              💡 AI-assistenten bruker maskinlæring for å lage profesjonelle tilbudsbeskrivelser som øker sjansen for å vinne jobben.
            </div>
          </div>
        </div>
      )}

      {/* Custom Material Modal */}
      {showCustomMaterialModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCustomMaterialModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111827]">Legg til egendefinert produkt</h2>
              <button
                onClick={() => setShowCustomMaterialModal(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Produktnavn *
                </label>
                <input
                  type="text"
                  value={customMaterialName}
                  onChange={(e) => setCustomMaterialName(e.target.value)}
                  placeholder="f.eks. Spesialtakstein"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Kategori
                </label>
                <input
                  type="text"
                  value={customMaterialCategory}
                  onChange={(e) => setCustomMaterialCategory(e.target.value)}
                  placeholder="f.eks. Takstein"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Enhet *
                  </label>
                  <select
                    value={customMaterialUnit}
                    onChange={(e) => setCustomMaterialUnit(e.target.value)}
                    className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  >
                    <option value="stk">stk</option>
                    <option value="m">m</option>
                    <option value="m²">m²</option>
                    <option value="liter">liter</option>
                    <option value="kg">kg</option>
                    <option value="pk">pk</option>
                    <option value="sett">sett</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">
                    Pris per enhet (kr) *
                  </label>
                  <input
                    type="number"
                    value={customMaterialPrice}
                    onChange={(e) => setCustomMaterialPrice(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCustomMaterialModal(false)}
                  className="flex-1 h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Avbryt
                </button>
                <button
                  onClick={createCustomMaterial}
                  className="flex-1 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
                >
                  Legg til
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Edit Modal */}
      {showPriceEditModal && editingMaterial && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPriceEditModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#111827]">Tilpass pris og mengde</h2>
              <button
                onClick={() => setShowPriceEditModal(false)}
                className="text-[#6B7280] hover:text-[#111827]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-[#F3F4F6] rounded-lg p-4">
                <div className="font-semibold text-[#111827] mb-1">{editingMaterial.name}</div>
                <div className="text-sm text-[#6B7280]">{editingMaterial.category}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Pris per {editingMaterial.unit} (kr)
                </label>
                <input
                  type="number"
                  value={editedPrice}
                  onChange={(e) => setEditedPrice(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
                <div className="text-xs text-[#6B7280] mt-1">
                  Foreslått pris: {editingMaterial.pricePerUnit} kr/{editingMaterial.unit}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-2">
                  Mengde ({editingMaterial.unit})
                </label>
                <input
                  type="number"
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                  placeholder="1"
                  min="1"
                  step="1"
                  className="w-full h-12 px-4 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#17384E]"
                />
              </div>

              <div className="bg-[#E07B3E]/10 border border-[#E07B3E]/20 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#111827] font-medium">Total:</span>
                  <span className="text-[#E07B3E] font-bold text-lg">
                    {((parseFloat(editedPrice) || 0) * (parseFloat(editedQuantity) || 0)).toLocaleString("nb-NO")} kr
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPriceEditModal(false)}
                className="flex-1 h-12 border border-gray-300 text-[#111827] rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={confirmAddMaterial}
                className="flex-1 h-12 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
              >
                Bekreft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}