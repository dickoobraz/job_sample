# job_sample

This is a sample nodejs app

Дано:
Есть абстрактное NodeJS-приложение, обслуживающее HTTP-запросы и хранящее данные в MySQL. Параметры подключения к MySQL и HTTP-порт задаются через переменные окружения. Сборка приложения выполняется командами `npm install && npm run build`, запуск - командой `node dist/main.js`.

Задача: 
1. Описать сборку и развертывание N экземпляров такого приложения в Kubernetes (с балансировкой входящих запросов между экземплярами). 
2. Обеспечить централизованный сбор логов приложения из STDOUT/STDERR. 
3. Описать возможные подходы к мониторингу состояния приложения. 
Допускается использование любого подходящего инструментария.

Результат: 
Набор конфигурационных файлов и скриптов для решения поставленной задачи, а также README с описанием решения и инструкциями по его использованию.

1. Исходный код приложения находится в директории dist. Код позволяет выполнить запрос в БД, примерный дамп БД предоставлен в файле dump.mysql. Приложение пакуется с помощью Dockerfile и пушится в публичный DockerHub. Запуск приложения осуществляется с помощью helm, чарт для которого находится в директории helm_chart. Балансировка запросов к репликам приложения осуществляется через сущность LoadBalancer. В данном чарте включена и используется возможность Horizontal Pod Autoscaler которая, в зависимости от нагрузки на приложение, управляет количеством его дубликатов для обеспечения высокой доступности.

2. Для централизованного сбора логов из подов предлагаю выбрать из двух вариантов - стек EFK (Elasticsearch Fluentd Kibana) и loghouse (Fluentd, Clickhouse, webUI). Так как компания, по результатам беседы, уже эксплуатирует кластер Clickhouse и имеет опыт работы с ним, а так-же то, что Clickhouse обеспечивает меньший оверхед в случае разворачивания его внутри кластера то предпочтительным становится использование именно этого решения для сбора логов. Установка данной системы сбора логов происходит очень просто с помощью публичного helm-chart https://github.com/flant/loghouse

3. Мониторинг предлагается осуществлять с помощью Prometheus. Для визуализации метрик - Grafana. Для улучшения полноты мониторинга самые критичные параметры приложения выводить в отдельный endpoint в формате OpenMetrics (например факт использования определенных роутов, результат их выполнения, время на выполнение и пр.). Для контроля связности между зависимыми сервисами приложения и визуализации задержек применить Jaeger. Для команды разработки следует прописать манифест, согласно которому будет писаться поддержка мониторинга в выпускаемом продукте.



пара доп.вопросов по заданию:
1. Какие можно предложить способы оптимизации сборки контейнера с приложением относительно твоего текущего решения?
2. С какой целью ты используешь istio?
3. Можешь показать пример пайплайна (для любой системы, на твой вкус), который мог бы применяться для сборки и деплоя в этой задаче?

---
a. Первым делом можно оптимизировать сборку контейнера переходом с образа node:14 на облегченную сборку на основе Alpine Linux, который оптимизирован для выполнения в системах оркестризации. Кроме того после билда можно создавать еще один слой onion с выполненной после билда очисткой от ненужных элементов.
b. Istio очень хорошо уживается с Jaeger и, ценой небольшого плюса к оверхеду на рабочих нодах, можно получить отслеживание сетевых задержек в приложении, управляемые ретраи запросов и наглядную конфигурируемость внутренней сети. Впрочем, от использования Istio можно легко отказаться без всяческих последствий и простоя.
c. Пример пайплайна можно посмотреть в jenkins_pplne. В приложении рекомендуется написать тесты, которые будут задействоваться в этом пайплайне (например успешный коннект до бд, выборка тестовых значений в дев-окружении на тестовом наборе данных)
