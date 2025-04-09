<?php
// Active l'affichage des erreurs pour le débogage
error_reporting(E_ALL);
ini_set("display_errors", 1);

// Inclut l'autoloader de Composer pour charger les dépendances
require_once 'vendor/autoload.php';

// Utilise les classes nécessaires de l'API Gemini
use GeminiAPI\Client;
use GeminiAPI\Resources\ModelName;
use GeminiAPI\Resources\Parts\TextPart;

// Clé API Gemini
$apiKey = 'AIzaSyAXhjAIWWkSiVKYwnc-dM7JfeCGFwttO9Q'; //ajoute la clé API

// Vérifie si une question a été envoyée via POST
if (isset($_POST['question'])) {
    $question = $_POST['question']; // Récupère la question de l'utilisateur

    try {
        // Initialise le client de l'API Gemini
        $client = new Client($apiKey);

        // Log pour déboguer
        error_log("Question reçue : " . $question);

        // Utilisez la version v1beta de l'API
        $response = $client->withV1BetaVersion()
            ->generativeModel(ModelName::GEMINI_1_5_FLASH) // Utilisez le modèle Gemini 1.5 Flash
            ->withSystemInstruction('Tu es un assistant spécialisé dans le domaine de la santé et de la beauté des cheveux afro. Tu aides à comprendre comment en prendre soin, les faire pousser, et quelle routine adopter pour garder des cheveux beaux et soyeux. Tu donnes des conseils sur les coiffures adaptées aux différents types de cheveux afro, ainsi que sur l\'alimentation et les produits à utiliser. Tu ne réponds qu\'aux questions liées aux cheveux afro.')
            ->generateContent(
                new TextPart('Question: ' . $question . ' Réponse:')
            );

        $answer = $response->text(); // Extrait le texte de la réponse

        // Limiter la réponse à 150 mots pour éviter des réponses trop longues
        $answer = implode(' ', array_slice(explode(' ', $answer), 0, 1500));

        // Log pour déboguer
        error_log("Réponse de l'API Gemini (tronquée à 150 mots) : " . $answer);
 
        // Renvoie la réponse au format JSON
        echo json_encode(['answer' => $answer]);

    } catch (Exception $e) {
        // Log pour déboguer
        error_log("Erreur lors de l'appel à l'API Gemini : " . $e->getMessage());

        // Renvoie un message d'erreur au format JSON
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
