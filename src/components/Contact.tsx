'use client'

import {useReveal} from '@/hooks/useReveal'
import {useRef, useState} from "react";

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function Contact() {
    const {ref, className, style} = useReveal()
    const formRef = useRef<HTMLFormElement>(null)
    const [status, setStatus] = useState<SubmitStatus>("idle")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (status === "sending") return

        const form = formRef.current
        if (!form) return
        const formData = new FormData(form)
        setStatus("sending")

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: formData.get('user_name'),
                    email: formData.get('user_email'),
                    company: formData.get('user_company'),
                    role: formData.get('user_role'),
                    message: formData.get('message'),
                    website: formData.get('website'),
                }),
            })

            if (!response.ok) throw new Error(`Contact API returned ${response.status}`)
            form.reset()
            setStatus("success")
            setTimeout(() => setStatus("idle"), 3000)
        } catch (error) {
            console.error(error)
            setStatus("error")
        }
    }

    return (
        <section
            ref={ref as React.RefObject<HTMLElement>}
            className={`section contact ${className}`}
            id="contact"
            style={style}
        >
            <div
                className="shell build-share-run"
                aria-label="Цикл работы с агентами"
            >
                <article>
                    <p>Создать</p>
                    <span>Собираем агента из кейса, данных, ролей и KPI.</span>
                </article>
                <article>
                    <p>Поделиться</p>
                    <span>Публикуем шаблон для бизнеса, ИТ, ИБ и риск-офиса.</span>
                </article>
                <article>
                    <p>Запустить</p>
                    <span>
            Запускаем в рабочем контуре с аудитом и метриками эффекта.
          </span>
                </article>
            </div>
            <div className="shell contact-layout">
                <div className="contact-copy">
                    <h2>Рабочая сессия по вашему ИИ-контуру</h2>
                    <p>
                        За 60 минут соберем проектную гипотезу: целевой процесс, KPI и
                        базовый уровень, ограничения ИБ/комплаенса и план запуска первого
                        сценария в промышленную эксплуатацию.
                    </p>
                    <ul>
                        <li>Какой первый кейс выбрать, чтобы защитить инвестицию</li>
                        <li>Какая архитектура пройдет внутреннюю проверку</li>
                        <li>Как перейти от кейса к портфелю без потери темпа</li>
                    </ul>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="lead-form">
                    <div className="field">
                        <input type="text" name="user_name" id="name" required placeholder=""/>
                        <label htmlFor="name">Имя</label>
                    </div>
                    <div className="field">
                        <input type="email" name="user_email" id="email" required placeholder=""/>
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="field">
                        <input type="text" name="user_company" id="company" placeholder=""/>
                        <label htmlFor="company">Компания</label>
                    </div>
                    <div className="field">
                        <input type="text" name="user_role" id="role" placeholder=""/>
                        <label htmlFor="role">Роль</label>
                    </div>
                    <div className="field full">
                        <textarea name="message" id="task" placeholder=""/>
                        <label htmlFor="task">Контур и KPI</label>
                    </div>
                    <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        style={{position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0}}
                    />
                    <button className="btn btn-blue full" type="submit" disabled={status === "sending"}>
                        {status === "sending" ? "Отправляем..." : "Отправить сообщение"}
                    </button>
                    {status === "success" ? <ul className="phase-results">
                        <li>Сообщение отправлено</li>
                    </ul> : null}
                    {status === "error" ? <ul className="phase-results">
                        <li>Не удалось отправить сообщение. Попробуйте еще раз.</li>
                    </ul> : null}
                </form>
            </div>
            
        </section>
    )
}
