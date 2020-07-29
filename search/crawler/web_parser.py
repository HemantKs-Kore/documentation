import traceback
import urllib.robotparser as urobot
import urllib.request
from bs4 import BeautifulSoup



def robo_parser(url):
    rp = urobot.RobotFileParser()
    rp.set_url(url + "/robots.txt")
    rp.read()
    all_sites = []

    if rp.can_fetch("*", url):
        site = urllib.request.urlopen(url)
        sauce = site.read()
        soup = BeautifulSoup(sauce, "html.parser")
        actual_url = site.geturl()[:site.geturl().rfind('/')]
        my_list = soup.find_all("a", href=True)
        for i in my_list:
            # rather than != "#" you can control your list before loop over it
            if i != "#":
                newurl = str(actual_url)+"/"+str(i)
                try:
                    # if rp.can_fetch("*", newurl):
                    #     site = urllib.request.urlopen(newurl)
                        all_sites.append(newurl)
                        # do what you want on each authorized webpage
                except:
                    # print(traceback.format_exc())
                    pass
    else:
        print("cannot scrap")

    print(all_sites)

def curl_parser(url):
    import os
    result = os.popen("curl "+url).read()
    result_data_set = {"Disallowed":[], "Allowed":[]}

    for line in result.split("\n"):
        if line.startswith('Allow'):    # this is for allowed url
            result_data_set["Allowed"].append(line.split(': ')[1].split(' ')[0])    # to neglect the comments or other junk info
        elif line.startswith('Disallow'):    # this is for disallowed url
            result_data_set["Disallowed"].append(line.split(': ')[1].split(' ')[0])    # to neglect the comments or other junk info

    print (result_data_set)

if __name__ == "__main__":
    url = "https://www.online.citibank.co.in"
    robo_parser(url)
    print('-'*32)
    curl_parser(url)