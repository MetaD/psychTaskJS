#!/usr/bin/python

# Author: Meng Du
# Aug 1, 2016

import sys
import csv
import json
from collections import OrderedDict


def parse(json_obj, data_file):
    # 1) Get CSV Headers
    header = ["subject ID", "start time", "end time"]
    trial_attributes = ["type", "trial_index", "is_training", "stimulus", "rt",      # for all trials
                        "number",       # for number and self trials
                        "statement",    # for self trials
                        "response", "share_value", "private_value", "earned_value"]  # for private/share choice trials
    num_non_trial_column = len(header)

    # iterate through subjects to find out the length of header (i.e. the max number of trials)
    max_num_trials = 0
    for subjectId in json_obj:
        current_num_trials = len(json_obj[subjectId]) - num_non_trial_column
        if current_num_trials > max_num_trials:
            max_num_trials = current_num_trials

    # create header
    for trial_index in range(1, max_num_trials + 1):
        for attribute in trial_attributes:
            header.append("trial_" + str(trial_index) + "/" + attribute)

    data_file.writerow(header)  # write to file

    # 2) Get Subject Data
    for firebaseSubjectId in json_obj:
        subject = json_obj[firebaseSubjectId]
        if "id" not in subject:  # invalid subject?
            continue
        subject_id = subject["id"]
        start_time = subject["start_time"]
        if "end_time" in subject:
            end_time = subject["end_time"]
        else:
            end_time = ''   # no end time means the participant did not finish
        csv_row = [subject_id, start_time, end_time]
        for trialId in subject:
            if trialId == "id" or trialId == "start_time" or trialId == "end_time":  # not a trial
                continue
            json_trial_data = subject[trialId]
            for attribute in trial_attributes:
                if attribute in json_trial_data:
                    csv_row.append(json_trial_data[attribute])
                else:
                    csv_row.append("")

        # write to files
        data_file.writerow(csv_row)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print "Please pass the name of the json file as an argument. For example:"
        print "    python parser.py sharing-task-export.json"
        sys.exit(0)
    filename = sys.argv[1]
    with open(filename) as jsonFile:
        data_file = csv.writer(open("results.csv", "wb+"))
        parse(json.load(jsonFile, object_pairs_hook=OrderedDict), data_file)
