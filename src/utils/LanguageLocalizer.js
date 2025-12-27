import English from "assets/lang/en.json";
import Turkish from "assets/lang/tr.json";


function LanguageLocalizer() {
    var selected_language = localStorage.getItem('lang');
    if (selected_language == null)
        selected_language = "tr"

    if (selected_language === "tr")
        return Turkish;
    else if (selected_language === "en")
        return English;
}

export function ChangeLanguage(language) {
    localStorage.setItem('lang', language)
}

export default LanguageLocalizer()