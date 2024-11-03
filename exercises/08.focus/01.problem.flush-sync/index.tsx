import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import * as ReactDOM from 'react-dom/client'

function EditableText({
	id,
	initialValue = '',
	fieldName,
	inputLabel,
	buttonLabel,
}: {
	id?: string
	initialValue?: string
	fieldName: string
	inputLabel: string
	buttonLabel: string
}) {
	const [edit, setEdit] = useState(false)
	const [value, setValue] = useState(initialValue)
	const inputRef = useRef<HTMLInputElement>(null)
	// 🐨 add a button ref here
	const buttonRef = useRef<HTMLButtonElement>(null)

	return edit ? (
		<form
			method="post"
			onSubmit={(event) => {
				event.preventDefault()
				// here's where you'd send the updated value to the server
				// 🐨 wrap these calls in a flushSync
				flushSync(() => {
					setValue(inputRef.current?.value ?? '')
					setEdit(false)
				})
				buttonRef.current?.focus()
				// 🐨 after flushSync, focus the button with the button ref
			}}
		>
			<input
				required
				ref={inputRef}
				type="text"
				id={id}
				aria-label={inputLabel}
				name={fieldName}
				defaultValue={value}
				onKeyDown={(event) => {
					if (event.key === 'Escape') {
						// 🐨 wrap this in a flushSync
						flushSync(() => {
							setEdit(false)
						})
						buttonRef.current?.focus()
						// 🐨 after the flushSync, focus the button
					}
				}}
				onBlur={(event) => {
					// 🐨 wrap these in a flushSync
					flushSync(() => {
						setValue(event.currentTarget.value)
						setEdit(false)
					})

					// 🐨 after the flushSync, focus the button
					buttonRef.current?.focus()
				}}
			/>
		</form>
	) : (
		<button
			aria-label={buttonLabel}
			// 🐨 add a ref prop for the button
			ref={buttonRef}
			type="button"
			onClick={() => {
				// 🐨 wrap this in a flushSync
				flushSync(() => {
					setEdit(true)
				})
				// 🐨 after the flushSync, select all the text of the input
				inputRef.current?.select()
			}}
		>
			{value || 'Edit'}
		</button>
	)
}

function App() {
	return (
		<main>
			<button>Focus before</button>
			<div className="editable-text">
				<EditableText
					initialValue="Unnamed"
					fieldName="name"
					inputLabel="Edit project name"
					buttonLabel="Edit project name"
				/>
			</div>
			<button>Focus after</button>
		</main>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
