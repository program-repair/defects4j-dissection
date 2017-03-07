#!/usr/bin/env python
import os
import subprocess
import shutil
import re
import operator
from Config import config

root = config.get('path', 'root')
defects4j_path = config.get('path', 'defects4j')
defects4j_bin_path = os.path.join(defects4j_path, 'framework', 'bin')
defects4j_projects_path = os.path.join(defects4j_path, 'framework', 'projects')
defects4j_checkout_path = config.get('path', 'checkout')
defects4j_fix_checkout_path = config.get('path', 'fix_checkout')
output_path = config.get('path', 'output')
git_url = config.get('git', 'url')


def str_intersection(s1, s2):
    out = ""
    for c in s1.split("/"):
        if c in s2 and c not in out:
            out += c + "/"
    return out


def parse_project_info(value):
    project_info = {}
    for line in value.splitlines():
        split = line.split(':', 1)
        if len(split) == 2:
            key = split[0].strip().replace(' ', '_').lower()
            value = split[1].strip()
            project_info[key] = value
    return project_info


def get_project_info(project):
    cmd = """export PATH="%s:$PATH"
defects4j info -p %s
""" % (defects4j_bin_path, project)
    output = subprocess.check_output(cmd, shell=True)
    return parse_project_info(output)


def get_project_source(project, bug_id):
    wd = os.path.join(defects4j_fix_checkout_path, project.lower(), "%s_%s" % (project.lower(), bug_id))

    cmd = """export PATH="%s:$PATH"
defects4j export -p dir.src.classes	-w %s 2> /dev/null
""" % (defects4j_bin_path, wd)

    output = subprocess.check_output(cmd, shell=True)
    return os.path.join(project.lower(), "%s_%s" % (project.lower(), bug_id), output)


def get_project_changed_classes(project, bug_id):
    wd = os.path.join(defects4j_fix_checkout_path, project.lower(), "%s_%s" % (project.lower(), bug_id))

    cmd = """export PATH="%s:$PATH"
defects4j export -p classes.modified -w %s 2> /dev/null
""" % (defects4j_bin_path, wd)

    output = subprocess.check_output(cmd, shell=True)
    return output.splitlines()


def commit(project, bug_id, bug_output_path, param):
    cmd = """cd %s
git add %s
git commit --allow-empty -m "%s files form %s #%s"
""" % (os.path.join(root, output_path), bug_output_path, param, project, bug_id)

    output = subprocess.check_output(cmd, shell=True)
    m = re.search("\[master ([0-9a-x]+)\]", output)
    if m is not None:
        return m.group(1)
    else:
        m = re.search("\[master \(root-commit\) ([0-9a-x]+)\]", output)
        if m is not None:
            return m.group(1)
    pass


def generate_readme(commit_id):
    output = "# Defects4j presentation Urls\n\n"
    url = git_url + "/blob/{0}/{1}"
    url_diff = git_url + "/commit/{0}"

    for project, value in sorted(commit_id.items(), key=operator.itemgetter(1)):
        output += "## %s \n" % project

        output += " Bug id | Buggy | Fixed | Diff \n"
        output += "--------|-------|-------|------\n"
        for bug_id, commit in sorted(value.items(), key=lambda t: int(t[0])):
            output += " {0} | [Buggy]({1}) | [Fixed]({2}) | [Diff]({3}) \n".format(
                bug_id,
                url.format(commit['bug'], commit['path']),
                url.format(commit['fix'], commit['path']),
                url_diff.format(commit['fix'])
            )
    with open(os.path.join(root, 'README.md'), 'w') as file:
        file.write(output)
    pass


def main():
    commit_id = {}
    for project in os.listdir(defects4j_projects_path):
        if project == 'lib':
            continue
        if os.path.isfile(os.path.join(defects4j_projects_path, project)):
            continue
        info = get_project_info(project)
        commit_id[project] = {}
        for bug_id in xrange(1, int(info['number_of_bugs']) + 1):
            source = get_project_source(project, bug_id)
            changed_classes = get_project_changed_classes(project, bug_id)
            bug_output_path = os.path.join(root, output_path, project, str(bug_id))
            commit_id[project][bug_id] = {
                'bug': None,
                'fix': None,
                'path': os.path.join(output_path, project, str(bug_id))
            }
            intersection_folder = None
            for changed_class in changed_classes:
                class_name = changed_class.replace(".", "/") + ".java"
                if intersection_folder is None:
                    intersection_folder = class_name
                else:
                    intersection_folder = str_intersection(intersection_folder, class_name)
                class_path = os.path.join(source, class_name)
                file_output_path = os.path.join(bug_output_path, class_name)
                if not os.path.exists(os.path.dirname(file_output_path)):
                    os.makedirs(os.path.dirname(file_output_path))
                shutil.copy(os.path.join(defects4j_checkout_path, class_path), file_output_path)
            commit_id[project][bug_id]['bug'] = commit(project, bug_id, bug_output_path, "buggy")
            for changed_class in changed_classes:
                class_name = changed_class.replace(".", "/") + ".java"
                class_path = os.path.join(source, class_name)
                file_output_path = os.path.join(bug_output_path, class_name)
                if not os.path.exists(os.path.dirname(file_output_path)):
                    os.makedirs(os.path.dirname(file_output_path))
                shutil.copy(os.path.join(defects4j_fix_checkout_path, class_path), file_output_path)

            commit_id[project][bug_id]['path'] = os.path.join(commit_id[project][bug_id]['path'], intersection_folder)
            commit_id[project][bug_id]['fix'] = commit(project, bug_id, bug_output_path, "fixed")
        generate_readme(commit_id)


if __name__ == '__main__':
    main()
