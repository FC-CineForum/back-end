from bs4 import BeautifulSoup
import requests
import time
import random
from Celebrity import Celebrity
from Movie import Movie
from Series import Series
from Episode import Episode
from Roles import Roles
from Presentation import Presentation

from ConexionBase import add_celebrity
from ConexionBase import add_movie
from ConexionBase import add_series
from ConexionBase import add_episode
from ConexionBase import add_role


IMDBURL = 'https://www.imdb.com'

def top_movie_mining():
    url = 'https://www.imdb.com/chart/top/?ref_=nv_mv_250'
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    mytds = soup.find_all("td", {"class": "titleColumn"})
    for td in mytds:
        mine_entry('https://www.imdb.com/' + td.a['href'], 'mv')

def mine_entry(url, entry_flag, id_series=-1):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')

    title = mine_title(soup)

    presentation = mine_presentation(soup, entry_flag)
    release_date = presentation.release_date
    classification = presentation.classification
    duration = presentation.duration

    imgs = mine_imgs(soup)
    img = imgs[0]
    trailer = imgs[1]

    syn = mine_synopsis(soup)

    id_entry = -1
    if entry_flag == 'mv':
        print(title)
        movie = Movie(title, syn, img, trailer, release_date, classification, duration)
        if duration > 0:
            id_entry = add_movie(movie)
    elif entry_flag == 'sr':
        print(title)
        series = Series(title, syn , img, trailer, release_date, classification)
        id_entry = add_series(series)
        mine_episodes(url + 'episodes', id_entry)
    elif entry_flag == 'ep':
        print(title)
        info = mine_episode_season(soup)
        episode = Episode(title, syn, img, release_date, classification, id_series, info[0], info[1], duration)
        print('Season Cap: ', info[0], info[1])
        if int(info[1]) > 0:
            id_entry = add_episode(episode)
    mine_celebrities(soup, id_entry)

def mine_episode_season(soup):
    attrs = 'ipc-inline-list ipc-inline-list--show-dividers sc-2a366625-2 iALCjm baseAlt'
    content = soup.find('ul', {'class':attrs})
    season = content.contents[0].next_element.next_element
    if len(content.contents) > 1:
        episode = content.contents[1].next_element.next_element
    else:
        episode = 'E0'
    return (season[1:], episode[1:])

def mine_title(soup):
    attrs = 'hero-title-block__title'
    title = soup.find('h1', {'data-testid':attrs})
    return title.next_element


def mine_presentation(soup, entry_flag='mv'):
    attrs = 'ipc-inline-list ipc-inline-list--show-dividers sc-8c396aa2-0 kqWovI baseAlt'
    contents = soup.find('ul', {'class':attrs}).contents
    return Presentation(contents)

def mine_imgs(soup):
    attrs = 'ipc-image'
    imgs = soup.find_all('img', {'class':attrs}, limit=2)
    return [imgs[0]['src'], imgs[1]['src']]

def mine_synopsis(soup):
    attrs = 'plot-l'
    synopsis = soup.find('span', {'data-testid':attrs})
    return synopsis.next_element

def mine_celebrities(soup, id_entry):
    attrs = 'ipc-metadata-list ipc-metadata-list--dividers-all title-pc-list ipc-metadata-list--baseAlt'
    ul = soup.find('ul', {'class':attrs})
    for li in ul:
        for lis in li:
            celebrities = lis.find_all('a')
            for a in celebrities:
                url = 'https://www.imdb.com' + a['href']
                n = len(url)
                role = Roles(url[n-2:n]).name #last two chars have the role
                id_celebrity = mine_celebrity(url[:n-14])
                if id_entry != -1:
                    add_role(id_celebrity, id_entry, role)

def mine_celebrity(url):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')

    name = mine_name(soup)

    bio = mine_bio(soup)

    img = mine_cel_img(soup)

    celebrity = Celebrity(name, bio, img)
    id_celebrity = add_celebrity(celebrity)
    return id_celebrity


def mine_name(soup):
    attrs = 'header'
    name = soup.find('h1', {'class':attrs})
    return name.next_element.next_element.next_element

def mine_cel_img(soup):
    attrs = 'name-poster'
    img = soup.find('img', {'id':attrs})
    return img['src'] if img is not None else 'NA'

def mine_bio(soup):
    attrs = 'inline'
    bio = soup.find('div', {'class':attrs})
    return bio.next_element if bio is not None else 'NA'

def top_series_mining():
    url = 'https://www.imdb.com/chart/toptv/?ref_=nv_tvv_250'
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    mytds = soup.find_all("td", {"class": "titleColumn"})
    for td in mytds:
        mine_entry('https://www.imdb.com/' + td.a['href'], 'sr')

def mine_episodes(url, id_series):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    attrs = 'bySeason'
    select = soup.find('select', {'id':attrs})
    no_seasons = 1 if select is None else len(select.find_all('option'))
    for no_season in range(1, no_seasons+1):
        mine_season(url + '?season=' + str(no_season), id_series)

def mine_season(url, id_series):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    attrs = 'name'
    ass = soup.find_all('a', {'itemprop':attrs})
    for a in ass:
        mine_entry(IMDBURL + a['href'], 'ep', id_series=id_series)

def new_release_mining():
    url = 'https://www.imdb.com/calendar/?ref_=nv_mv_cal'
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')
    attrs = 'main'
    div = soup.find('div', {'id':attrs}).find_all('a')
    for a in div:
        mine_entry(IMDBURL + a['href'], 'mv')

