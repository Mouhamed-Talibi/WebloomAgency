document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitSpinner = document.getElementById('submitSpinner');
    const btnText = document.querySelector('.btn-text');
    const btnIcon = document.querySelector('.btn-icon');
    const formStatus = document.getElementById('formStatus');

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.startsWith('212')) {
                // Format: +212 X XX XXX XXX
                if (value.length > 2) {
                    value = '+212 ' + value.substring(2, 3) + ' ' + value.substring(3, 5) + ' ' + value.substring(5, 8) + ' ' + value.substring(8, 11);
                }
            } else {
                // Format local: 0X XX XX XX XX
                if (value.length > 0) {
                    value = value.substring(0, 2) + ' ' + value.substring(2, 4) + ' ' + value.substring(4, 6) + ' ' + value.substring(6, 8) + ' ' + value.substring(8, 10);
                }
            }
        }
        e.target.value = value.trim();
    });

    // Form validation function
    function validateForm(formData) {
        let errors = [];
        let isValid = true;

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

        // Validate Full Name (required)
        if (!formData.fullname || formData.fullname.trim() === '') {
            document.getElementById('fullname-error').textContent = 'Le nom complet est requis';
            document.getElementById('fullname').classList.add('error');
            isValid = false;
        } else if (formData.fullname.trim().length < 2) {
            document.getElementById('fullname-error').textContent = 'Nom trop court';
            document.getElementById('fullname').classList.add('error');
            isValid = false;
        }

        // Validate Email (optional but valid if provided)
        if (formData.email && formData.email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                document.getElementById('email-error').textContent = 'Email invalide';
                document.getElementById('email').classList.add('error');
                isValid = false;
            }
        }

        // Validate Phone (required)
        if (!formData.phone || formData.phone.trim() === '') {
            document.getElementById('phone-error').textContent = 'Le téléphone est requis';
            document.getElementById('phone').classList.add('error');
            isValid = false;
        } else {
            const phoneDigits = formData.phone.replace(/\D/g, '');
            if (phoneDigits.length < 9) {
                document.getElementById('phone-error').textContent = 'Numéro de téléphone invalide';
                document.getElementById('phone').classList.add('error');
                isValid = false;
            }
        }

        // Validate Service (required)
        if (!formData.service || formData.service === '') {
            document.getElementById('service-error').textContent = 'Veuillez sélectionner un service';
            document.getElementById('service').classList.add('error');
            isValid = false;
        }

        // Validate Message (required)
        if (!formData.message || formData.message.trim() === '') {
            document.getElementById('message-error').textContent = 'Le message est requis';
            document.getElementById('message').classList.add('error');
            isValid = false;
        } else if (formData.message.trim().length < 10) {
            document.getElementById('message-error').textContent = 'Message trop court (minimum 10 caractères)';
            document.getElementById('message').classList.add('error');
            isValid = false;
        }

        return isValid;
    }

    // Format message for WhatsApp
    function formatWhatsAppMessage(formData) {
        const date = new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        return `*📱 NOUVELLE DEMANDE DE CONTACT - Webloom*
━━━━━━━━━━━━━━━━━━━━━
*Date :* ${date}

*👤 INFORMATIONS PERSONNELLES*
━━━━━━━━━━━━━━━━━━━━━
*Nom complet :* ${formData.fullname}
*Téléphone :* ${formData.phone}
${formData.email ? `*Email :* ${formData.email}` : '*Email :* Non fourni'}

*📋 DÉTAILS DU PROJET*
━━━━━━━━━━━━━━━━━━━━━
*Service souhaité :* ${formData.service}

*💬 MESSAGE*
━━━━━━━━━━━━━━━━━━━━━
${formData.message}

━━━━━━━━━━━━━━━━━━━━━
_Message envoyé depuis le site Webloom_`;
    }

    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            fullname: document.getElementById('fullname').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim()
        };

        // Validate form
        if (!validateForm(formData)) {
            formStatus.innerHTML = '<div class="alert alert-error">Veuillez corriger les erreurs dans le formulaire</div>';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitSpinner.classList.remove('d-none');
        btnText.classList.add('opacity-0');
        btnIcon.classList.add('opacity-0');
        formStatus.innerHTML = '';

        // Format the message
        const whatsappMessage = formatWhatsAppMessage(formData);
        
        // WhatsApp number (remove spaces and +)
        const whatsappNumber = '212775461072'; // +212 7 75 46 10 72
        
        // Create WhatsApp URL
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(whatsappMessage)}`;

        try {
            // Simulate a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Open WhatsApp in new tab
            window.open(whatsappUrl, '_blank');
            
            // Show success message
            formStatus.innerHTML = '<div class="alert alert-success">Message préparé avec succès ! Redirection vers WhatsApp...</div>';
            
            // Optional: Reset form after successful submission
            setTimeout(() => {
                if (confirm('Souhaitez-vous réinitialiser le formulaire ?')) {
                    contactForm.reset();
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error:', error);
            formStatus.innerHTML = '<div class="alert alert-error">Une erreur est survenue. Veuillez réessayer.</div>';
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitSpinner.classList.add('d-none');
            btnText.classList.remove('opacity-0');
            btnIcon.classList.remove('opacity-0');
        }
    });

    // Real-time validation (optional)
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorId = this.id + '-error';
            const errorElement = document.getElementById(errorId);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
});