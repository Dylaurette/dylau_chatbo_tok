document.addEventListener('DOMContentLoaded', function () {
  const chatContainer = document.getElementById('chat'); // Zone de chat
  const inputField = document.getElementById('input'); // Champ de saisie
  const sendButton = document.getElementById('button'); // Bouton d'envoi

  // Envoyer un message
  sendButton.addEventListener('click', function () {
    sendMessage();
  });

  inputField.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  // Fonction pour envoyer un message
  function sendMessage() {
    const question = inputField.value.trim();
    if (question !== '') {
      appendMessage('Vous', question, 'user'); // Ajouter le message de l'utilisateur
      inputField.value = '';

      // Afficher un indicateur de chargement
      const loading = document.createElement('div');
      loading.classList.add('message', 'bot');
      loading.innerHTML = `
        <div class="text">
          <div class="loading"></div>
        </div>
      `;
      chatContainer.appendChild(loading);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      // Envoyer la question au backend
      fetch('backend.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'question=' + encodeURIComponent(question),
      })
        .then((response) => response.json())
        .then((data) => {
          // Supprimer l'indicateur de chargement
          chatContainer.removeChild(loading);

          if (data.error) {
            appendMessage('Assistant', 'Erreur: ' + data.error, 'bot');
          } else {
            let emoji = '';
            if (question.includes('math') || question.includes('calcul')) {
              emoji = '🧮'; 
            } else if (question.includes('hors sujet')) {
              emoji = '🤔'; // Emoji pour les questions hors sujet
            } else {
              emoji = '👍'; // Emoji par défaut
            }
            appendMessage('Assistant', data.answer + ' ' + emoji, 'bot');
          }
        })
        .catch(() => {
          chatContainer.removeChild(loading);
          appendMessage('Assistant', 'Une erreur s\'est produite. Veuillez réessayer.', 'bot');
        });
    }
  }

  // Ajouter un message à la zone de chat
  function appendMessage(sender, message, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.innerHTML = `
      <div class="text">
        <strong>${sender}:</strong> ${message}
      </div>
    `;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  
});