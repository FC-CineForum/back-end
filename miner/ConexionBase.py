import psycopg2
import os
from dotenv import load_dotenv
from Celebrity import Celebrity
from Episode import Episode
from Movie import Movie
from Series import Series
from Roles import Roles
from configparser import ConfigParser

load_dotenv()

conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_DATABASE'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'))

def add_celebrity(celebrity):
    cur = conn.cursor()
    sql_statement = """SELECT id_celebrity FROM celebrity WHERE name = %s"""
    cur.execute(sql_statement, (celebrity.name,))
    id_celebrity = cur.fetchone()
    if id_celebrity is None:
        sql_statement = """INSERT INTO celebrity(name, biography, picture) VALUES (%s, %s, %s) RETURNING id_celebrity"""
        values = (celebrity.name, celebrity.bio, celebrity.img)
        cur.execute(sql_statement, values)
        id_celebrity = cur.fetchone()
    conn.commit()
    cur.close()
    return id_celebrity[0]

def add_movie(movie):
    cur = conn.cursor()
    sql_statement = """SELECT id_movie FROM movie WHERE id_movie=(SELECT id_entry FROM entry WHERE title=%s AND release = %s)"""
    cur.execute(sql_statement, (movie.title,movie.release))
    id_movie = cur.fetchone()
    if id_movie is None:
        sql_statement = """INSERT INTO entry(image, synopsis, title, release, classification, type) VALUES (%s, %s, %s, %s, %s, \'m\') RETURNING id_entry"""
        values = (movie.img, movie.syn, movie.title, movie.release, movie.classification)
        cur.execute(sql_statement, values)
        id_movie = cur.fetchone()
        sql_statement = """INSERT INTO movie VALUES (%s, %s, %s)"""
        values = (id_movie, movie.trailer, movie.duration)
        cur.execute(sql_statement, values)
    conn.commit()
    cur.close()
    return id_movie[0]

def add_series(series):
    cur = conn.cursor()
    sql_statement = """SELECT id_series FROM series WHERE id_series=(SELECT id_entry FROM entry WHERE title=%s AND release = %s)"""
    cur.execute(sql_statement, (series.title,series.release))
    id_series = cur.fetchone()
    if id_series is None:
        sql_statement = """INSERT INTO entry(image, synopsis, title, release, classification, type) VALUES (%s, %s, %s, %s, %s, \'s\') RETURNING id_entry"""
        values = (series.img, series.syn, series.title, series.release, series.classification)
        cur.execute(sql_statement, values)
        id_series = cur.fetchone()
        sql_statement = """INSERT INTO series VALUES (%s, %s)"""
        values = (id_series, series.trailer)
        cur.execute(sql_statement, values)
    conn.commit()
    cur.close()
    return id_series[0]

def add_episode(episode):
    cur = conn.cursor()
    sql_statement = """SELECT id_episode FROM episode JOIN entry ON episode.id_episode = entry.id_entry WHERE entry.title = %s AND episode.id_series = %s AND episode.season = %s"""
    cur.execute(sql_statement, (episode.title, episode.id_series, episode.season))
    id_episode = cur.fetchone()
    if id_episode is None:
        sql_statement = """INSERT INTO entry(image, synopsis, title, release, classification, type) VALUES (%s, %s, %s, %s, %s, \'e\') RETURNING id_entry"""
        values = (episode.img, episode.syn, episode.title, episode.release, episode.classification)
        cur.execute(sql_statement, values)
        id_episode = cur.fetchone()
        sql_statement = """INSERT INTO episode VALUES (%s, %s, %s, %s, %s)"""
        values = (id_episode, episode.id_series, episode.season, episode.noChapter, episode.duration)
        cur.execute(sql_statement, values)
    conn.commit()
    cur.close()
    return id_episode[0]

def add_role(id_celebrity, id_entry, role):
    cur = conn.cursor()
    sql_statement = """SELECT * FROM roles WHERE id_celebrity = %s AND id_entry = %s AND role = %s"""
    cur.execute(sql_statement, (id_celebrity, id_entry, role))
    if cur.fetchone() is None:
        sql_statement = """INSERT INTO roles VALUES (%s, %s, %s)"""
        cur.execute(sql_statement, (id_celebrity, id_entry, role))
    conn.commit()
    cur.close()
