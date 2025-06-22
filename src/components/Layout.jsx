export default function Layout(props){
    
    const { children } = props

    const header = (
        <header>
            <h1 className="text-gradient">The Brogram</h1>
            <p><strong>The 30 Simple Workouts Program</strong></p>
        </header>
    )
    
    const footer = (
        <footer>
            <p>Built by <a href="https://www.smoljames.com"
             target="_blank">KhamoshMehta</a><br/><a href="https://www.fantacss.smoljames.com" 
             target="_blank">FantaCSS</a></p>
        </footer>

    ) 

    

    return(
        <>
            {header}
            {children}  
            {footer}      
        </>
    )
}