import React, { useState, useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from './components/NewsCards/NewsCards';
import useStyles from './styles.js';
import wordsToNumbers from 'words-to-numbers';

const alanKey = '1af6a75c7b75c58dea0111287c9741962e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {

    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle, setActiveArticle] = useState(-1);
    const classes = useStyles();

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                    setNewsArticles(articles);
                    setActiveArticle(-1);
                }
                else if (command === 'highlight') {
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                }
                else if (command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];

                    if (parsedNumber > 20) {
                        alanBtn().playText('Please try that again.');
                    }
                    else if (article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...');
                    }
                }
            }
        });
    }, []);

    return (
        <div>
            <div className={classes.logoContainer}>
                <img src="https://alan.app/brand_assets/seal/color-white/alan-seal-horizontal-color-white.png" className={classes.alanLogo} alt="powered by alan logo" />
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        </div>
    );
}

export default App;