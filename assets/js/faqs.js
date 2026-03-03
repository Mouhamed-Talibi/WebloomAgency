document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-icon i');
        
        question.addEventListener('click', () => {
            const expanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQs (optional - remove if you want multiple open)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    otherAnswer.setAttribute('aria-hidden', 'true');
                    otherQuestion.querySelector('.faq-icon i').className = 'fa-solid fa-plus';
                }
            });
            
            // Toggle current FAQ
            question.setAttribute('aria-expanded', !expanded);
            answer.setAttribute('aria-hidden', expanded);
            
            // Toggle icon
            if (!expanded) {
                icon.className = 'fa-solid fa-minus';
            } else {
                icon.className = 'fa-solid fa-plus';
            }
        });
    });
    
    // Add structured data for SEO
    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Combien coûte un site vitrine ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Le prix dépend de la complexité et des fonctionnalités. Contactez-nous pour un devis personnalisé gratuit."
                }
            },
            {
                "@type": "Question",
                "name": "Combien de temps pour créer un site ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "La durée varie selon la complexité du projet : site vitrine simple (2-3 semaines), site avec fonctionnalités avancées (4-6 semaines), site e-commerce (6-8 semaines)."
                }
            },
            {
                "@type": "Question",
                "name": "Le site sera-t-il optimisé mobile ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolument ! Tous nos sites sont conçus avec une approche mobile-first et sont entièrement responsifs sur tous les appareils."
                }
            },
            {
                "@type": "Question",
                "name": "Proposez-vous le support ?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Oui, nous proposons plusieurs formules de support et maintenance : support technique, maintenance évolutive, hébergement et formation."
                }
            }
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(faqStructuredData);
    document.head.appendChild(script);
});