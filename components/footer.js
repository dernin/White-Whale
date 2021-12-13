export default function Footer(props) {
    var d = new Date()
    var year = d.getFullYear()
    return <footer className="footer is-fixed-bottom">
        &copy; Devin Curtis {year}. Built with Next.js. <a href="https://www.lookandlearn.com/history-images/YW041167V/Men-are-fishing-for-whale-in-small-boats-with-harpoons?t=1&q=whale&n=132" rel="noreferrer" target="_blank">Background picture</a> used with permission  
         <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer"> (CC BY 4.0).</a> 
    </footer>
}