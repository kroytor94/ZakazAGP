// Мобильное меню
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu';
mobileMenu.innerHTML = `
    <div class="mobile-menu-content">
        <button class="mobile-close-button">
            <i class="fas fa-times"></i>
        </button>
        <nav class="mobile-nav">
            <a href="#services">Услуги</a>
            <a href="#advantages">Преимущества</a>
            <a href="#equipment">Техника</a>
            <a href="tel:+79190213818" class="mobile-cta-button">
                <i class="fas fa-phone"></i> Позвонить
            </a>
            <a href="#contact" class="mobile-cta-button">Заказать</a>
        </nav>
    </div>
`;

document.body.appendChild(mobileMenu);

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.mobile-close-button') || 
        (e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-content'))) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Плавная прокрутка
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
        
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Валидация телефона
const phoneInput = document.querySelector('input[type="tel"]');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9+]/g, '');
    });
}

// Отправка формы в Telegram
const orderForm = document.getElementById('fastOrderForm');
if (orderForm) {
    orderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        
        try {
            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());
            
            // Форматируем дату для красивого отображения
            const formattedDate = new Date(data.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                weekday: 'short'
            });

            const message = `📅 Новая заявка на автовышку:

👤 Имя: ${data.name}
📞 Телефон: ${data.phone}
📅 Дата: ${formattedDate}
📝 Описание: ${data.message || 'Не указано'}

⏱ ${new Date().toLocaleString()}`;

            // Отправка в Telegram
            const telegramResponse = await fetch(`https://api.telegram.org/bot7204468027:AAHQgq3seLFjPyzyQQJ3NoCogfxSL-e4EjU/sendMessage?chat_id=285897275&text=${encodeURIComponent(message)}`);
            
            if (telegramResponse.ok) {
                showSuccessMessage();
                this.reset();
            } else {
                throw new Error('Ошибка Telegram API');
            }
        } catch (error) {
            alert('Ошибка отправки. Пожалуйста, позвоните нам напрямую: +7 (919) 021-38-18');
            console.error('Ошибка:', error);
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
        }
    });
}

// Показ сообщения об успешной отправке
function showSuccessMessage() {
    const popup = document.getElementById('formSuccess');
    if (!popup) return;
    
    popup.style.display = 'block';
    
    setTimeout(() => {
        popup.style.animation = 'fadeIn 0.3s reverse';
        setTimeout(() => {
            popup.style.display = 'none';
            popup.style.animation = 'fadeIn 0.3s';
        }, 300);
    }, 3000);
}

// Анимация при скролле
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .advantage-card, .spec-item, .contact-item');
    
    elements.forEach(el => {
        const elPosition = el.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if(elPosition < screenPosition) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Изначально скрываем элементы
document.querySelectorAll('.service-card, .advantage-card, .spec-item, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s ease-out';
});

window.addEventListener('scroll', animateOnScroll);
animateOnScroll();

// Фиксированная шапка
const header = document.querySelector('.modern-header');
if (header) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// Установка даты в форме
const dateInput = document.getElementById('date');
if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
    
    let maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];
}

// Обработчик плавающей кнопки
const floatingOrderBtn = document.getElementById('floatingOrderBtn');
if (floatingOrderBtn) {
    floatingOrderBtn.addEventListener('click', function() {
        // Плавно прокручиваем к форме заказа
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            window.scrollTo({
                top: contactSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });

    // Показываем/скрываем плавающую кнопку при скролле
    let lastScrollPosition = 0;
    window.addEventListener('scroll', function() {
        const currentScrollPosition = window.pageYOffset;
        
        if (currentScrollPosition > lastScrollPosition) {
            // Скроллим вниз - скрываем кнопку
            floatingOrderBtn.style.transform = 'translateY(100px)';
        } else {
            // Скроллим вверх - показываем кнопку
            floatingOrderBtn.style.transform = 'translateY(0)';
        }
        
        lastScrollPosition = currentScrollPosition;
        
        // Внизу страницы всегда показываем кнопку
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            floatingOrderBtn.style.transform = 'translateY(0)';
        }
    });
}
