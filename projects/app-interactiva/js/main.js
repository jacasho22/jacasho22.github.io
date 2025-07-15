// Navegación responsive
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
};

// Tabs para la sección de demo
const initTabs = () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
};

// Calculadora
class Calculator {
    constructor() {
        this.operationDisplay = document.querySelector('.calculator-operation');
        this.resultDisplay = document.querySelector('.calculator-result');
        this.keys = document.querySelector('.calculator-keys');
        this.operation = '';
        this.result = '0';
        this.resetResult = true;
        this.lastKey = '';
        
        this.init();
    }
    
    init() {
        this.keys.addEventListener('click', e => {
            if (e.target.matches('button')) {
                const key = e.target;
                const action = key.dataset.action;
                const keyContent = key.textContent;
                
                if (!action) {
                    this.inputNumber(keyContent);
                } else {
                    this.handleAction(action, keyContent);
                }
                
                this.updateDisplay();
            }
        });
    }
    
    inputNumber(number) {
        if (this.resetResult || this.result === '0') {
            this.result = number;
            this.resetResult = false;
        } else {
            this.result += number;
        }
        this.lastKey = 'number';
    }
    
    handleAction(action, keyContent) {
        switch(action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'calculate':
                this.calculate();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'percent':
                this.percent();
                break;
            default:
                this.handleOperator(action, keyContent);
        }
    }
    
    handleOperator(action, keyContent) {
        const operators = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷'
        };
        
        if (this.lastKey === 'operator') {
            // Replace the last operator
            this.operation = this.operation.slice(0, -1) + operators[action];
        } else {
            if (this.operation === '' || this.lastKey === 'calculate') {
                this.operation = this.result;
            } else if (this.lastKey === 'number') {
                this.calculate();
            }
            this.operation += ` ${operators[action]} `;
            this.resetResult = true;
        }
        
        this.lastKey = 'operator';
    }
    
    calculate() {
        if (this.lastKey === 'operator') {
            return;
        }
        
        let calculation = this.operation + this.result;
        calculation = calculation.replace(/×/g, '*').replace(/÷/g, '/');
        
        try {
            const answer = eval(calculation);
            this.result = Number.isInteger(answer) ? answer.toString() : answer.toFixed(2).toString();
            this.operation = '';
            this.lastKey = 'calculate';
        } catch (e) {
            this.result = 'Error';
        }
    }
    
    clear() {
        this.operation = '';
        this.result = '0';
        this.resetResult = true;
        this.lastKey = 'clear';
    }
    
    delete() {
        if (this.result.length === 1) {
            this.result = '0';
        } else {
            this.result = this.result.slice(0, -1);
        }
        this.lastKey = 'delete';
    }
    
    inputDecimal() {
        if (this.resetResult) {
            this.result = '0.';
            this.resetResult = false;
        } else if (!this.result.includes('.')) {
            this.result += '.';
        }
        this.lastKey = 'decimal';
    }
    
    percent() {
        this.result = (parseFloat(this.result) / 100).toString();
        this.lastKey = 'percent';
    }
    
    updateDisplay() {
        this.operationDisplay.textContent = this.operation;
        this.resultDisplay.textContent = this.result;
    }
}

// Todo List
class TodoApp {
    constructor() {
        this.todoInput = document.getElementById('todo-input');
        this.addButton = document.getElementById('add-todo');
        this.todoList = document.getElementById('todo-list');
        
        this.init();
    }
    
    init() {
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.addTodo();
        });
        
        this.todoList.addEventListener('click', e => {
            const target = e.target.closest('button');
            if (!target) return;
            
            const todoItem = target.closest('.todo-item');
            
            if (target.classList.contains('todo-complete')) {
                todoItem.classList.toggle('completed');
                const todoText = todoItem.querySelector('.todo-text');
                todoText.style.textDecoration = todoText.style.textDecoration === 'line-through' ? 'none' : 'line-through';
            } else if (target.classList.contains('todo-delete')) {
                todoItem.style.animation = 'fadeOut 0.3s ease';
                todoItem.addEventListener('animationend', () => todoItem.remove());
            }
        });
    }
    
    addTodo() {
        const todoText = this.todoInput.value.trim();
        if (todoText === '') return;
        
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        todoItem.style.animation = 'fadeIn 0.3s ease';
        
        todoItem.innerHTML = `
            <span class="todo-text">${todoText}</span>
            <div class="todo-actions">
                <button class="todo-complete"><i class="fas fa-check"></i></button>
                <button class="todo-delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        this.todoList.appendChild(todoItem);
        this.todoInput.value = '';
    }
}

// Galería de imágenes
class Gallery {
    constructor() {
        this.images = document.querySelectorAll('.gallery-img');
        this.thumbnails = document.querySelectorAll('.gallery-thumb');
        this.prevBtn = document.getElementById('prev-img');
        this.nextBtn = document.getElementById('next-img');
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.prevBtn.addEventListener('click', () => this.showPrevImage());
        this.nextBtn.addEventListener('click', () => this.showNextImage());
        
        this.thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const index = parseInt(thumb.getAttribute('data-index'));
                this.showImage(index);
            });
        });
    }
    
    showImage(index) {
        this.images.forEach(img => img.classList.remove('active'));
        this.thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        this.images[index].classList.add('active');
        this.thumbnails[index].classList.add('active');
        this.currentIndex = index;
    }
    
    showPrevImage() {
        const newIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
        this.showImage(newIndex);
    }
    
    showNextImage() {
        const newIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
        this.showImage(newIndex);
    }
}

// Inicializar todo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    initTabs();
    
    // Inicializar componentes cuando se muestra su tab
    const tabBtns = document.querySelectorAll('.tab-btn');
    let calculator, todoApp, gallery;
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            if (tabId === 'tab1' && !calculator) {
                calculator = new Calculator();
            } else if (tabId === 'tab2' && !todoApp) {
                todoApp = new TodoApp();
            } else if (tabId === 'tab3' && !gallery) {
                gallery = new Gallery();
            }
        });
    });
    
    // Inicializar el componente activo por defecto
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    if (activeTab === 'tab1') {
        calculator = new Calculator();
    } else if (activeTab === 'tab2') {
        todoApp = new TodoApp();
    } else if (activeTab === 'tab3') {
        gallery = new Gallery();
    }
    
    // Smooth scrolling para los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Ajuste para el header fijo
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animación al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .demo-container, .contact .container');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Aplicar estilos iniciales para la animación
    document.querySelectorAll('.feature-card, .demo-container, .contact .container').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Ejecutar una vez al cargar la página
});

// Añadir keyframes para fadeOut
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);