import { CSSProperties } from 'react'
import { TbFilesOff, TbShoppingCartOff } from 'react-icons/tb'
import styles from './styles.module.scss'
import { useNavigate } from 'react-router-dom'

const NoProducts = ({ title, message, style, icon, buttonMsg, buttonLink, buttonIcon }:
{ title: string, message: string, style?: CSSProperties, icon?: 'cart' | 'product', buttonMsg?: string, buttonLink?: string, buttonIcon?: JSX.Element }) => {
	const navigate = useNavigate()

	return (
		<div className={styles.noProducts} style={style}>
			<div className={styles.icon}>
				{!icon || icon == 'product' ? <TbFilesOff />
				: icon == 'cart' && <TbShoppingCartOff />}
			</div>
			<div className={styles.title}>
				{title}
			</div>
			<div className={styles.text}>
				{message}
			</div>
			{(buttonMsg && buttonLink && buttonIcon) &&
				<button onClick={() => navigate(buttonLink)}>
					{buttonIcon} {buttonMsg}
				</button>
			}
		</div>
	)
}

export default NoProducts