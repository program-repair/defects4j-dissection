import re
import os
import requests
import time
import json
from urllib.parse import urlparse
from bs4 import BeautifulSoup

def extract_info(template):
    # Extract project name
    # All URLs of secion contains 'https://github.com/.../projects/project_name/...'
    project_match = re.search(r'projects/([^/]+)', template)
    project_name = project_match.group(1) if project_match else None

    # Extract bug IDs and URL links
    # 'bug_id | [Buggy](url) | [Fixed](url) | [Diff](url)'
    bug_matches = re.findall(r'\n\s*(\d+)\s+\|\s+\[Buggy\]\(([^)]+)\)\s+\|\s+\[Fixed\]\(([^)]+)\)\s+\|\s+\[Diff\]\(([^)]+)\)', template)
    bugs = []
    for bug in bug_matches:
        bug_id = bug[0]
        urls = {'Buggy': bug[1], 'Fixed': bug[2]}
        bugs.append({'Bug ID': bug_id, 'URLs': urls})

    return project_name, bugs

def download_content(url, filename):
    response = requests.get(url)
    if response.status_code == 200:
        # By default, response.text add empty line after each line of text
        content = response.text.splitlines()

        # Remove one empty line after each non-empty line
        filtered_content = []
        for i, line in enumerate(content):
            stripped_line = line.strip()
            if stripped_line:
                filtered_content.append(stripped_line)
                if i < len(content) - 1 and not content[i+1].strip():
                    filtered_content.append('')  # Add an empty line
       
        with open(filename, 'w', encoding='utf-8') as file:
            file.write('\n'.join(content))

        print(f"Downloaded content from {url}: {filename}")
        print()
    else:
        print(f"Failed to download content from {url}")
        print()

def extract_directory_link(link_url, filename_prefix):
    global ptc_num
    base_url = link_url.split('/projects')[0]
    
    response_org = requests.get(link_url)
    if response_org.status_code == 200:
        # If single_file
        if 'rawLines' in response_org.text:
            raw_url = link_url.replace('blob', 'raw')
            if raw_url.endswith('/'):
                raw_url = raw_url[:-1]
            java_file_name = re.search(r'\/([^\/]+)$',raw_url)
            if java_file_name:
                output_path = os.path.join(output_folder, filename_prefix)+"-"+java_file_name.group(1)
                if not os.path.exists(output_path):
                    ptc_num += 1
                    download_content(raw_url, output_path)
                else:
                    print(f"Still downloaded: {output_path}")
                    print()
                    
        # If file_list
        elif 'rawLines' not in response_org.text:
            matchProjectTree = re.search(r"\"tree\":{\"items\":(.*?])", response_org.text)
            if matchProjectTree:
                jsonProjectTree = json.loads(matchProjectTree.group(1))
                for elem in jsonProjectTree:
                    if elem['contentType'] == 'directory':
                        raw_url = base_url+'/'+elem['path']
                        extract_directory_link(raw_url, filename_prefix)
                    elif elem['contentType'] == 'file':
                        raw_url = base_url.replace('blob', 'raw')+'/'+elem['path']
                        java_file_name = elem['name']
                        output_path = os.path.join(output_folder, filename_prefix)+"-"+elem['name']
                        if not os.path.exists(output_path):
                            ptc_num += 1
                            download_content(raw_url, output_path)
                        else:
                            print(f"Still downloaded: {output_path}")
                            print()
     

# Start the timer
start_time = time.time()

ptc_num = 0

# Load template from MD file
patch_list_filename = os.path.join(os.getcwd(), '..', 'defects4j-patch.md')
with open(patch_list_filename, 'r') as file:
    patch_list_template = file.read()

# Split the template into individual sections
# '... ## Chart...\n## Time...'
sections = re.split(r'(?=## \w+)', patch_list_template)

# Extract information of project_name and bugs array from each section
extracted_infos = []
for section in sections:
    project, bugs = extract_info(section)
    extracted_infos.append({'Project': project, 'Bugs': bugs})

# Create the output folder if it doesn't exist
output_folder = os.path.join(os.getcwd(), '..', 'Downloaded-Patches')
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Download content from each link
for extracted_info in extracted_infos:
    project = extracted_info['Project']
    for bug in extracted_info['Bugs']:
        bug_id = bug['Bug ID']
        for link_version, link_url in bug['URLs'].items():
            filename_parts = [project, bug_id, link_version]
            filename_prefix = '-'.join(filename_parts)
            parsed_url = urlparse(link_url)
            if parsed_url.scheme and parsed_url.netloc:
                extract_directory_link(link_url, filename_prefix)
            # else:
                # print(f"Invalid URL: {link_url}")


# Stop the timer
end_time = time.time()

# Calculate the execution time
execution_time = end_time - start_time
# Print the execution time
print()
print(f"Execution time: {execution_time} seconds")

print(f"TOTAL NUMBER OF PATCH FILES: {ptc_num}")

