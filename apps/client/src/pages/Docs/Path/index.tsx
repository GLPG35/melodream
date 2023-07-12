import { TbCheck, TbChevronLeft, TbClipboard } from 'react-icons/tb'
import styles from './styles.module.scss'
import { SetStateAction, Dispatch, useEffect, useState, ChangeEvent, MouseEvent } from 'react'
import { manageSnippets } from '../../../utils/server'
import { motion } from 'framer-motion'

const DocsPath = ({ selectedPath, changeSelection, components }: { selectedPath: { path: string, method: any }, changeSelection: Dispatch<SetStateAction<{path: string, method: any} | undefined>>, components: any }) => {
	let parseSchema: any
	let rType: any
	let resContent: any
	const { path, method } = selectedPath
	const [ methodN, methodD ] = Object.entries(method).flat() as [string, any]
	const { requestBody, responses } = methodD
	const { 200: okResponse, ...badResponses } = responses
	const parseResponses = Object.entries(badResponses)
	const [snippets, setSnippets] = useState<any>([])
	const [snippet, setSnippet] = useState<any>()
	const [arrow, setArrow] = useState(false)
	const [cpStatus, setCpStatus] = useState(false)
	const [cp2Status, setCp2Status] = useState(false)

	if (requestBody) {
		const [ type, schema ] = Object.entries(requestBody.content).flat()
		const { schema: { $ref } } = schema as any
		parseSchema = $ref ? components[$ref.split('/')[1]][$ref.split('/')[2]] : (schema as any).schema
		rType = type
	}

	if (okResponse.content) {
		const [ _type, schema ] = Object.entries(okResponse.content).flat()
		console.log(schema)
		const { schema: { $ref } } = schema as any
		resContent = $ref ? components[$ref.split('/')[1]][$ref.split('/')[2]] : (schema as any).schema
	}

	useEffect(() => {
		if (!snippets.length) {
			manageSnippets(
				methodN.toUpperCase(),
				path,
				requestBody ? [{ name: 'Content-Type', value: 'application/json' }] : undefined,
				requestBody ? { mimeType: 'application/json', text: JSON.stringify(parseSchema.example) } : undefined
			).then(snippets => {
				setSnippets(snippets)

				setSnippet(snippets.find((x: { name: string }) => x.name === 'curl').snippet)
			})
		}
	}, [])

	const copyText = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, text: string, callback: Dispatch<SetStateAction<boolean>>) => {
		if (e.currentTarget.disabled) return
		
		navigator.clipboard.writeText(text)
		.then(() => {
			callback(true)

			setTimeout(() => {
				callback(false)
			}, 2000)
		})
	}

	const changeSnippet = (e: ChangeEvent<HTMLSelectElement>) => {
		const name = e.currentTarget.value

		setSnippet(snippets.find((x: { name: string }) => x.name === name).snippet)
	}

	return (
		<div className={styles.selectedPath}>
			<div className={styles.back} onClick={() => changeSelection(undefined)}>
				<div className={styles.icon}>
					<TbChevronLeft />
				</div>
				<span>General Info</span>
			</div>
			<div className={styles.title}>
				<h2>{methodD.name}</h2>
				<div className={`${styles.method} ${styles[methodN]}`}>
					{methodN}
				</div>
			</div>
			<div className={styles.subTitle}>
				{path}
			</div>
			<div className={styles.summary}>
				{methodD.summary}
			</div>
			<div className={styles.dataWrapper}>
				{(methodD.parameters !== undefined || methodD.requestBody) &&
					<div className={styles.optionalWrapper}>
						{methodD.parameters &&
							<div className={styles.parameters}>
								<div className={styles.parametersTitle}>
									Parameters
								</div>
								<div className={styles.parametersList}>
									{methodD.parameters.map(({ name, required, description, in: pos }: any) => {
										return (
											<div className={styles.parameter} key={name}>
												<div className={styles.name}>
													<span>{name}</span>
													{required && <div className={styles.required}>Required</div>}
													<div className={styles.in}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</div>
												</div>
												<div className={styles.description}>
													{description}
												</div>
											</div>
										)
									})}
								</div>
							</div>
						}
						{requestBody &&
							<div className={styles.requestBody}>
								<div className={styles.bodyTitle}>
									<span>Request Body</span>
									<div className={styles.type}>
										{rType as string}
									</div>
								</div>
								<div className={styles.bodyList}>
									{(Object.entries(parseSchema.properties) as any).map(([ key, value ]: [string, any]) => {
										return (
											<div className={styles.property} key={key}>
												<div className={styles.propertyTitle}>
													<div className={styles.name}>{key}</div>
													<div className={styles.type}>{value.type.charAt(0).toUpperCase() +  value.type.slice(1)}</div>
												</div>
												<div className={styles.propertyDescription}>
													{value.description}
												</div>
											</div>
										)
									})}
								</div>
							</div>
						}
					</div>
				}
				<div className={styles.requestWrapper}>
					<div className={styles.request}>
						<div className={styles.requestTitle}>
							<span>Request</span>
							<div className={styles.options}>
								<motion.div layout='position' className={styles.selectWrapper}>
									<select defaultValue='curl' onFocus={() => setArrow(true)}
									onBlur={() => setArrow(false)} onChange={changeSnippet}>
										<option value="curl">curl</option>
										<option value="javascript">javascript</option>
									</select>
									<motion.div animate={{ rotate: arrow ? -90 : 0 }} className={styles.arrow}>
										<TbChevronLeft />
									</motion.div>
								</motion.div>
								<motion.button layout onClick={(e) => copyText(e, snippet, setCpStatus)}
								disabled={cpStatus}>
									{!cpStatus ?
										<span>
											<TbClipboard />
											Copy
										</span>
									:
										<span>
											<TbCheck />
											Copied!
										</span>
									}
								</motion.button>
							</div>
						</div>
						<div className={styles.requestData}>
							{snippets.length > 0 &&
								<pre>
									{snippet}
								</pre>
							}
						</div>
					</div>
					<div className={styles.response}>
						<div className={styles.responseTitle}>
							<span>Response</span>
							<div className={styles.options}>
								{resContent &&
									<>
										<span className={styles.type}>json</span>
										<motion.button layout onClick={(e) => copyText(e, JSON.stringify(resContent.example, null, '\t'), setCp2Status)}
										disabled={cp2Status}>
											{!cp2Status ?
												<span>
													<TbClipboard />
													Copy
												</span>
											:
												<span>
													<TbCheck />
													Copied!
												</span>
											}
										</motion.button>
									</>
								}
							</div>
						</div>
						{resContent ?
							<div className={styles.responseData}>
								<pre>
									{JSON.stringify(resContent.example, null, '\t')}
								</pre>
							</div>
						:
							<div className={styles.responseOk}>
								<div className={styles.status}>200</div>
								<div className={styles.message}>
									Request completed successfully
								</div>
							</div>
						}
					</div>
					{(parseResponses.length > 0) &&
						<div className={styles.errors}>
							<div className={styles.errorsTitle}>
								<span>Errors</span>
							</div>
							<div className={styles.errorsData}>
								{parseResponses.map(([name, error]: [string, any]) => {
									return (
										<div className={styles.error} key={error.description}>
											<div className={styles.name}>
												{name}
											</div>
											<div className={styles.description}>
												{error.description}
											</div>
										</div>
									)
								})}
							</div>
						</div>
					}
				</div>
			</div>
		</div>
	)
}

export default DocsPath