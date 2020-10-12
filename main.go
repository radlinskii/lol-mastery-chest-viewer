package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/radlinskii/dotenv"
)

// Summoner represents summoner data returned from Riot API
type Summoner struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	IconID int    `json:"profileIconId"`
}

// Champion represents champion data returned from Riot API
type Champion struct {
	Level        int  `json:"championLevel"`
	ChestGranted bool `json:"chestGranted"`
	Points       int  `json:"championPoints"`
	ChampionID   int  `json:"championId"`
	LastPlayTime int  `json:"lastPlayTime"`
}

// SummonerWithChampions represents summoner data combined with his champions
type SummonerWithChampions struct {
	Summoner
	Champions []Champion `json:"champions"`
}

// NotFoundError is used on 404 response from Riot API
type NotFoundError struct {
	URL string
}

func (e NotFoundError) Error() string {
	return fmt.Sprintf("request to %q resulted with Not Found response", e.URL)
}

func myHandler(w http.ResponseWriter, r *http.Request) {
	_, err := w.Write([]byte("Hello World!"))
	if err != nil {
		fmt.Println(err)
		return
	}
}

func formHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var summonerName string
	err = json.Unmarshal(body, &summonerName)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	riotAPISummonerNameURL := "https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName
	body, err = fetchRiotAPI(riotAPISummonerNameURL)
	if err != nil {
		if _, ok := err.(NotFoundError); ok {
			http.Error(w, err.Error(), http.StatusNotFound)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		fmt.Println(err)
		return
	}

	var summoner Summoner
	err = json.Unmarshal(body, &summoner)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	riotAPIChampionMasteryURL := "https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summoner.ID
	body, err = fetchRiotAPI(riotAPIChampionMasteryURL)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var champions []Champion
	err = json.Unmarshal(body, &champions)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	output, err := json.Marshal(SummonerWithChampions{summoner, champions})
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	_, err = w.Write(output)
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func fetchRiotAPI(riotAPIURL string) ([]byte, error) {
	req, err := http.NewRequest("GET", riotAPIURL, nil)
	if err != nil {
		return nil, err
	}

	riotAPIToken := os.Getenv("RIOT_API_TOKEN")

	req.Header.Add("X-Riot-Token", riotAPIToken)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode == http.StatusNotFound {
		return nil, NotFoundError{riotAPIURL}
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

func main() {
	err := dotenv.SetEnv()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	port := os.Getenv("PORT")
	fmt.Println("server listening on port:", port)

	http.HandleFunc("/hello", myHandler)
	http.HandleFunc("/form", formHandler)
	http.Handle("/", http.FileServer(http.Dir("client/build")))
	http.ListenAndServe(":"+port, nil)
}
