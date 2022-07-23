import Layout from '../components/layout'
import AboutSection from '../components/aboutSection'
import Link from 'next/dist/client/link'
import { getAuthors, getAuthorWorks } from '../lib/authors'
import AuthorDescription from '../components/authorDescription'
import Block from '../components/block'
import { runQuery, getFabric } from '../lib/macrometa'
import { find } from 'find-in-files'
import authors from '../public/data/authors.json'

export async function getStaticProps() {

    const authorList = getAuthors()


    return {
        props: {
            authors,
            authorList,
        }
    }
}

export default function About(props) {
    const aboutText = <>
    <Block>White Whale is a tool for comparing the works of an author. Repetition of ideas, language, and allusions have struck me as a reader, as I have made my way through Herman Melville&apos;s complete works. Not only can you draw lines between the works on topics like sailing, characters finding themselves lost or stuck somewhere, and exploration of exotic locations that lead to inner discovery, but in classical allusions to Ovid and Homer in <em>White Jacket</em> and <em>Mardi</em> or Biblical allusions in <em>Moby-Dick</em> and <em>Clarel</em> (which unfortunately could not be included in the search &mdash; see below). I thought it would be helpful to new and seasoned academics and admirers of literature to be able to quickly cross reference between and within works to aid their scholarship and understanding of these texts. </Block>
    <Block>One could compare the use of &apos;savage&apos; across Melville&apos;s works or quickly see how many times &apos;poison&apos; appears in Shakespeare&apos;s plays.</Block>
    <Block>Please keep in mind that the search isn&apos;t perfect. It can be slow, especially when searching authors with a large bibliography like Shakespeare&apos;s. It also may not be completely accurate. It is based on optical character recognition (OCR) of digitally scanned copies of these texts. The OCR technology isn&apos;t perfect and can miss or misconstrue words, so you will want to reference the texts in question yourself, which you can do after searching by clicking on the given page number of a match.</Block>
    <Block>If you have suggestions for improvements or requests, <Link href="/contant"><a>please get in touch</a></Link>.</Block>
    </>
    
    const authorsText = <Block>An author must be in the public domain to be included on this site. Their works must be available as digital scans on <a target="_blank" rel="noreferrer" href="https://archive.org">archive.org</a> and must always be available for &apos;checkout&apos;. Suggestions for authors and versions of works to be included <Link href="/contact"><a>are welcome</a></Link>. Please see below for a list of the current authors, links to their included works and any associated notes with them.</Block>
    
    const techText = <>
    <Block>White Whale&apos;s search functionality is based off of <a target="_blank" rel="noreferrer" href="https://archive.org">archive.org</a> and <a target="_blank" rel="noreferrer" href="https://openlibrary.org">Open Library&apos;s </a>APIs. In building this website, I found that these APIs are not very well documented and there are some internal structural patterns that can be frustrating to work with. If you&apos;re interested in learning more about what I learned about using these APIs please visit the <a target="_blank" rel="noreferrer" href="https://github.com/dernin/white-whale">Github</a> for this project.</Block>
    <Block>The front-end is built with <a target="_blank" rel="noreferrer" href="https://nextjs.org/">Next.js</a> and the <a target="_blank" rel="noreferrer" href="https://bulma.io/">Bulma.io</a> CSS framework.</Block>
    </>
    return (
        <Layout>
            <AboutSection title="About White Whale" text={aboutText} />
            <AboutSection title="Authors" id="authors" text={authorsText}>{props.authorList.map(author => {
                return <AuthorDescription key={author} title={author} data={props.authors[author]}></AuthorDescription>
            })}</AboutSection>
            <AboutSection title="Technology" id="technology" text={techText}></AboutSection>
        </Layout>
    )
}