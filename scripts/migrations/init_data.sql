INSERT INTO users(username, hashed_password, name, email)
VALUES ('slava', '$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS', 'Slava', 'slava@vk.com'),
       ('kirill', '$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS', 'Kirill', 'kirill@vk.com'),
       ('petya', '$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS', 'Petya', 'petya@vk.com'),
       ('evgenii', '$2a$10$A4Ab/cuy/oLNvm4VxGoO/ezKL.fiew5e.eKTkUOWIVxoBh8XFO4lS', 'Evgenii', 'evgenii@vk.com');

INSERT INTO workspaces(user_id, title, description)
VALUES (1, 'Проект "Альфа"', 'Разработка нового веб-приложения для управления задачами'),
       (1, 'Проект "Бета"', 'Анализ данных и создание дашборда для маркетинговой отчетности'),
       (1, 'Проект "Гамма"', 'Прототипирование и дизайн интерфейса мобильного приложения'),
       (4, 'Проект "Дельта"', 'Рефакторинг и оптимизация базы данных'),
       (1, 'Проект "Эпсилон"', 'Тестирование и отладка серверной части системы'),
       (2, 'Проект "Зета"', 'Разработка API для интеграции с внешними сервисами'),
       (3, 'Проект "Эта"', 'Организация и проведение пользовательских интервью'),
       (4, 'Проект "Тета"', 'Исследование конкурентов и анализ рынка'),
       (1, 'Проект "Йота"', 'Внедрение системы контроля версий и совместной разработки'),
       (2, 'Проект "Каппа"', 'Создание руководств пользователя и документации');

INSERT INTO boards(workspace_id, title, description)
VALUES (1, 'Планирование и задачи', 'Доска для планирования и управления задачами проекта "Альфа"'),
       (1, 'Разработка функциональности', 'Доска для разработки новых функций и модулей проекта "Альфа"'),
       (1, 'Тестирование и отладка', 'Доска для тестирования и отладки программного кода проекта "Альфа"'),
       (2, 'Маркетинг и продвижение', 'Доска для планирования маркетинговых мероприятий проекта "Бета"'),
       (2, 'Анализ рынка', 'Доска для анализа рынка и конкурентов проекта "Бета"'),
       (2, 'Отчетность и аналитика', 'Доска для отчетности и анализа результатов проекта "Бета"'),
       (3, 'Дизайн и прототипирование', 'Доска для создания дизайнов и прототипов интерфейса проекта "Гамма"'),
       (3, 'Исследование пользователей', 'Доска для проведения исследований пользователей проекта "Гамма"'),
       (3, 'Тестирование юзабилити', 'Доска для тестирования юзабилити интерфейса проекта "Гамма"'),
       (4, 'Управление багами', 'Доска для отслеживания и управления ошибками и багами проекта "Дельта"'),
       (4, 'Оптимизация производительности', 'Доска для оптимизации производительности системы проекта "Дельта"'),
       (4, 'Совместная разработка', 'Доска для совместной разработки и контроля версий проекта "Дельта"'),
       (1, 'Тест-планы и сценарии', 'Доска для создания тест-планов и тестовых сценариев проекта "Эпсилон"'),
       (1, 'Автоматизированное тестирование', 'Доска для автоматизации тестирования серверной части проекта "Эпсилон"'),
       (2, 'Интеграция с внешними сервисами',
        'Доска для разработки API и интеграции с внешними сервисами проекта "Зета"'),
       (2, 'Безопасность и аутентификация', 'Доска для обеспечения безопасности и аутентификации в проекте "Зета"'),
       (3, 'Пользовательские интервью', 'Доска для организации и проведения пользовательских интервью проекта "Эта"'),
       (3, 'Анализ результатов интервью', 'Доска для анализа результатов пользовательских интервью проекта "Эта"'),
       (4, 'Конкурентный анализ', 'Доска для исследования конкурентов и анализа рынка проекта "Тета"'),
       (4, 'Стратегия продвижения', 'Доска для разработки стратегии продвижения проекта "Тета"'),
       (1, 'Управление версиями', 'Доска для внедрения системы контроля версий и совместной разработки проекта "Йота"'),
       (1, 'Документация и руководства', 'Доска для создания руководств пользователя и документации проекта "Каппа"');

INSERT INTO lists(board_id, title, position)
VALUES (1, 'Планирование', 1),
       (1, 'В работе', 2),
       (1, 'Готово', 3),
       (2, 'Анализ данных', 1),
       (2, 'Подготовка отчета', 2),
       (2, 'Маркетинговые мероприятия', 3),
       (3, 'Исследование пользователей', 1),
       (3, 'Прототипирование', 2),
       (3, 'Дизайн интерфейса', 3),
       (4, 'Баги и ошибки', 1),
       (4, 'Улучшения производительности', 2),
       (4, 'Техническая документация', 3),
       (5, 'Тест-планы', 1),
       (5, 'Автоматизированные тесты', 2),
       (5, 'Ручное тестирование', 3),
       (6, 'API разработка', 1),
       (6, 'Интеграция сторонних сервисов', 2),
       (6, 'Тестирование API', 3),
       (7, 'Пользовательские интервью', 1),
       (7, 'Анализ результатов', 2),
       (7, 'Отчет по интервью', 3),
       (8, 'Конкурентный анализ', 1),
       (8, 'Стратегия продвижения', 2),
       (8, 'Маркетинговые материалы', 3),
       (9, 'Управление версиями', 1),
       (9, 'Функциональная документация', 2),
       (9, 'Совместная разработка', 3),
       (10, 'Руководства пользователя', 1),
       (10, 'Техническая документация', 2),
       (10, 'FAQ', 3);

INSERT INTO cards (list_id, title, content, position)
VALUES
    -- Карточки для списка "Планирование"
    (1, 'Определение требований', 'Определить основные требования к проекту', 1),
    (1, 'Составление плана работ', 'Составить детальный план разработки проекта', 2),
    (1, 'Оценка рисков', 'Оценить возможные риски и предусмотреть меры по их снижению', 3),

    -- Карточки для списка "В работе"
    (2, 'Разработка интерфейса', 'Разработать пользовательский интерфейс приложения', 1),
    (2, 'Написание кода', 'Написать программный код для реализации функциональности', 2),
    (2, 'Тестирование модуля', 'Провести тестирование разработанного модуля', 3),

    -- Карточки для списка "Готово"
    (3, 'Завершение разработки', 'Завершить разработку и подготовить к выпуску', 1),
    (3, 'Проведение приемочных тестов', 'Провести приемочное тестирование и подтвердить работоспособность', 2),
    (3, 'Релиз продукта', 'Выпустить продукт и сообщить о его готовности', 3),

    -- Карточки для списка "Анализ данных"
    (4, 'Сбор данных', 'Собрать необходимые данные для анализа', 1),
    (4, 'Проведение статистического анализа', 'Проанализировать данные с помощью статистических методов', 2),
    (4, 'Визуализация результатов', 'Представить результаты анализа в виде графиков и диаграмм', 3),

    -- Карточки для списка "Подготовка отчета"
    (5, 'Составление структуры отчета', 'Определить структуру и содержание отчета', 1),
    (5, 'Написание текста отчета', 'Написать текстовую часть отчета с анализом результатов', 2),
    (5, 'Форматирование и оформление', 'Отформатировать отчет и придать ему профессиональный вид', 3),

    -- Карточки для списка "Маркетинговые мероприятия"
    (6, 'Планирование рекламной кампании', 'Разработать план рекламных мероприятий', 1),
    (6, 'Запуск рекламных кампаний', 'Запустить рекламные кампании на различных платформах', 2),
    (6, 'Отслеживание результатов', 'Отследить эффективность рекламных мероприятий и проанализировать результаты', 3),

    -- Карточки для списка "Исследование пользователей"
    (7, 'Определение целевой аудитории', 'Определить целевую аудиторию проекта', 1),
    (7, 'Проведение анкетирования', 'Провести анкетирование для сбора данных от пользователей', 2),
    (7, 'Анализ результатов анкетирования',
     'Проанализировать полученные данные и выявить ключевые требования пользователей', 3),

    -- Карточки для списка "Прототипирование"
    (8, 'Создание прототипов экранов',
     'Создать прототипы пользовательских экранов с использованием специальных инструментов', 1),
    (8, 'Тестирование прототипов', 'Протестировать прототипы на пользовательской аудитории', 2),
    (8, 'Внесение корректировок', 'Внести необходимые корректировки на основе результатов тестирования', 3),

    -- Карточки для списка "Дизайн интерфейса"
    (9, 'Создание стилевой концепции', 'Разработать стилевую концепцию для пользовательского интерфейса', 1),
    (9, 'Дизайн элементов интерфейса', 'Создать дизайн элементов интерфейса (кнопки, поля ввода и т.д.)', 2),
    (9, 'Формирование стайлгайда', 'Создать стайлгайд для единообразного оформления интерфейса', 3),

    -- Карточки для списка "Баги и ошибки"
    (10, 'Выявление багов', 'Выявить и зарегистрировать обнаруженные баги и ошибки', 1),
    (10, 'Анализ и исправление багов', 'Проанализировать причины возникновения багов и исправить их', 2),
    (10, 'Тестирование исправленных багов', 'Протестировать исправленные баги для подтверждения их исправности', 3),

    -- Карточки для списка "Улучшения производительности"
    (11, 'Анализ производительности', 'Проанализировать производительность системы и выявить узкие места', 1),
    (11, 'Оптимизация кода', 'Оптимизировать код для улучшения производительности', 2),
    (11, 'Тестирование производительности', 'Провести тестирование производительности для проверки результатов', 3),

    -- Карточки для списка "Техническая документация"
    (12, 'Создание технической спецификации', 'Создать техническую спецификацию проекта', 1),
    (12, 'Написание API-документации', 'Написать документацию по API для разработчиков', 2),
    (12, 'Формирование руководства администратора', 'Создать руководство администратора для системы', 3),

    -- Карточки для списка "Тест-планы"
    (13, 'Составление тест-плана', 'Составить детальный план проведения тестирования', 1),
    (13, 'Подготовка тестовых данных', 'Подготовить необходимые тестовые данные', 2),
    (13, 'Выполнение тестовых сценариев', 'Выполнить тестовые сценарии и зарегистрировать результаты', 3),

    -- Карточки для списка "Автоматизированные тесты"
    (14, 'Разработка автоматизированных тестов', 'Разработать скрипты для автоматизации тестирования', 1),
    (14, 'Запуск автоматизированных тестов', 'Запустить автоматизированные тесты для проверки функциональности', 2),
    (14, 'Анализ результатов', 'Проанализировать результаты автоматизированных тестов', 3),

    -- Карточки для списка "Ручное тестирование"
    (15, 'Планирование тестирования', 'Подготовить план ручного тестирования', 1),
    (15, 'Выполнение тестовых сценариев', 'Выполнить тестовые сценарии вручную и зарегистрировать результаты', 2),
    (15, 'Проверка работоспособности', 'Проверить работоспособность системы в различных сценариях', 3),

    -- Карточки для списка "API разработка"
    (16, 'Определение эндпоинтов', 'Определить список эндпоинтов для разработки', 1),
    (16, 'Разработка эндпоинтов', 'Разработать и реализовать эндпоинты API', 2),
    (16, 'Тестирование API', 'Провести тестирование разработанного API', 3),

    -- Карточки для списка "Интеграция с внешними сервисами"
    (17, 'Интеграция с платежной системой', 'Реализовать интеграцию с платежной системой', 1),
    (17, 'Интеграция с почтовым сервисом', 'Реализовать интеграцию с почтовым сервисом для отправки уведомлений', 2),
    (17, 'Тестирование интеграции', 'Провести тестирование интеграции с внешними сервисами', 3),

    -- Карточки для списка "Проведение пользовательских интервью"
    (18, 'Планирование интервью', 'Подготовить план проведения пользовательских интервью', 1),
    (18, 'Проведение интервью', 'Провести интервью с представителями целевой аудитории', 2),
    (18, 'Анализ результатов интервью', 'Проанализировать результаты интервью и выделить ключевые моменты', 3),

    -- Карточки для списка "Исследование конкурентов"
    (19, 'Сбор информации о конкурентах', 'Собрать информацию о конкурентах на рынке', 1),
    (19, 'Анализ конкурентной среды', 'Проанализировать конкурентную среду и выявить сильные и слабые стороны', 2),
    (19, 'Подготовка отчета', 'Подготовить отчет по исследованию конкурентов', 3),

    -- Карточки для списка "Тестирование и отладка"
    (20, 'Составление тест-плана', 'Составить план проведения тестирования', 1),
    (20, 'Выполнение тестовых сценариев', 'Выполнить тестовые сценарии и зарегистрировать результаты', 2),
    (20, 'Отладка и исправление ошибок', 'Выявить и исправить обнаруженные ошибки', 3);